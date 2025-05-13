from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import firebase_admin 
from firebase_admin import credentials, auth, firestore
import os
from dotenv import load_dotenv
from functools import wraps
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Initialize Firebase Admin
try:
    cred = credentials.Certificate("firebase-credentials.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logger.info("Firebase initialized successfully")
except Exception as e:
    logger.error(f"Error initializing Firebase: {str(e)}")
    raise

# Email configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')

if not SMTP_USERNAME or not SMTP_PASSWORD:
    logger.warning("Email credentials not found in environment variables")

def send_email_notification(to_email, subject, message):
    if not SMTP_USERNAME or not SMTP_PASSWORD:
        logger.error("Email credentials not configured")
        return False
        
    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_USERNAME
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(message, 'plain'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        logger.info(f"Email sent successfully to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return False

# Authentication decorator
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login_page'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        try:
            # Verify the user's credentials with Firebase
            user = auth.get_user_by_email(email)
            # Store user ID in session
            session['user_id'] = user.uid
            logger.info(f"User logged in successfully: {email}")
            return jsonify({'success': True, 'message': 'Login successful'})
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return jsonify({'success': False, 'message': str(e)}), 401
    
    if 'user_id' in session:
        return redirect(url_for('pomodoro'))
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register_page():
    if request.method == 'POST':
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        # Validate input
        if not email or not password:
            return jsonify({'success': False, 'message': 'Email and password are required'}), 400
        
        if len(password) < 6:
            return jsonify({'success': False, 'message': 'Password must be at least 6 characters long'}), 400
        
        try:
            # Create the user in Firebase
            user = auth.create_user(
                email=email,
                password=password
            )
            
            # Create a user document in Firestore
            user_data = {
                'email': email,
                'created_at': firestore.SERVER_TIMESTAMP,
                'settings': {
                    'work_duration': 25,
                    'short_break': 5,
                    'long_break': 15,
                    'long_break_interval': 4
                }
            }
            db.collection('users').document(user.uid).set(user_data)
            
            # Store user ID in session
            session['user_id'] = user.uid
            logger.info(f"User registered successfully: {email}")
            return jsonify({'success': True, 'message': 'Registration successful'})
        except auth.EmailAlreadyExistsError:
            logger.warning(f"Registration failed - email already exists: {email}")
            return jsonify({'success': False, 'message': 'Email already exists'}), 400
        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            return jsonify({'success': False, 'message': 'Registration failed. Please try again.'}), 400
    
    if 'user_id' in session:
        return redirect(url_for('pomodoro'))
    return render_template('register.html')

@app.route('/pomodoro', methods=['GET'])
@login_required
def pomodoro():
    return render_template('pomodoro.html')

@app.route('/api/notify', methods=['POST'])
@login_required
def send_notification():
    data = request.get_json()
    mode = data.get('mode')
    user_id = session.get('user_id')
    
    try:
        # Get user's email from Firestore
        user_doc = db.collection('users').document(user_id).get()
        if user_doc.exists:
            user_data = user_doc.to_dict()
            email = user_data.get('email')
            
            # Prepare notification message
            if mode == 'work':
                subject = "Break Time! 🎉"
                message = "Great job! Your work session is complete. Time for a well-deserved break."
            elif mode == 'shortBreak':
                subject = "Back to Work! 💪"
                message = "Short break is over. Ready to focus again?"
            else:  # longBreak
                subject = "Long Break Complete! 🌟"
                message = "Long break is over. Ready to start a new Pomodoro session?"
            
            # Send email notification
            if send_email_notification(email, subject, message):
                logger.info(f"Notification sent successfully to {email}")
                return jsonify({'success': True})
            else:
                logger.error(f"Failed to send notification to {email}")
                return jsonify({'success': False, 'message': 'Failed to send notification'}), 500
    except Exception as e:
        logger.error(f"Error sending notification: {str(e)}")
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/logout', methods=['GET'])
def logout():
    session.pop('user_id', None)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True) 
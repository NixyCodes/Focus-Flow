# FocusFlow
A web-based Focus-Flow Timer application built with Flask and Firebase, featuring user authentication, customizable timer settings, and email notifications.

## Features

- 🔐 User Authentication (Register/Login)
- ⏱️ Customizable Pomodoro Timer
  - Work sessions
  - Short breaks
  - Long breaks
- 📧 Email Notifications
- 🔄 Session Tracking
- 🎨 Clean and Intuitive UI

## Prerequisites

- Python 3.7 or higher
- Firebase account
- Gmail account (for email notifications)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/NixyCodes/Focus-Flow.git
cd Focus-Flow
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password


5. Firebase Setup:
- Create a Firebase project
- Download your Firebase credentials JSON file
- Rename it to `firebase-credentials.json` and place it in the root directory

## Running the Application

1. Make sure your virtual environment is activated
2. Run the Flask application:
```bash
python app.py
```
3. Open your browser and navigate to `http://localhost:5000`

## Usage

1. Register a new account or login with existing credentials
2. Access the Pomodoro timer
3. Customize your timer settings:
   - Work duration
   - Short break duration
   - Long break duration
   - Long break interval
4. Start your Pomodoro session
5. Receive email notifications when sessions end

## Project Structure
├── app.py # Main application file
├── requirements.txt # Python dependencies
├── firebase-credentials.json # Firebase configuration
├── static/ # Static files (CSS, JS, images)
├── templates/ # HTML templates
└── .env # Environment variables


## Technologies Used

- Backend:
  - Flask
  - Firebase Authentication
  - Firebase Firestore
  - Python-dotenv
  - Flask-Session

- Frontend:
  - HTML
  - CSS
  - JavaScript

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details

# Focus Flow 

A web-based Focus-Flow Timer application built with Flask and Firebase, featuring user authentication, customizable timer settings, and email notifications. Focus Flow helps you maintain productivity using the Pomodoro Technique.

## Features

- 🔐 Secure User Authentication
  - Email/Password registration and login
  - Session management
  - Secure password handling
- ⏱️ Customizable Pomodoro Timer
  - Adjustable work sessions (default: 25 minutes)
  - Configurable short breaks (default: 5 minutes)
  - Customizable long breaks (default: 15 minutes)
  - Set your preferred long break interval
- 📧 Email Notifications
  - Session completion alerts
  - Break time reminders
  - Custom notification messages
- �� Session Tracking
  - Track your work sessions
  - Monitor break times
  - View productivity patterns
- 🎨 Modern, Responsive UI
  - Clean and intuitive interface
  - Mobile-friendly design
  - Dark/Light mode support

## Prerequisites

- Python 3.7 or higher
- Firebase account
- Gmail account (for email notifications)
- Git

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

4. Environment Setup:
   - Create a `.env` file in the root directory
   - Add the following variables:
   ```
   SMTP_USERNAME=your-email@gmail.com
   SMTP_PASSWORD=your-app-specific-password
   ```

5. Firebase Configuration:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication and Firestore
   - Download your Firebase credentials
   - Create `firebase-credentials.json` in the root directory
   - Create `firebase-config.js` in the static/js directory
   - Add both files to `.gitignore` to keep them secure

## Project Structure
Focus-Flow/
├── app.py # Main application file
├── requirements.txt # Python dependencies
├── .env # Environment variables (not tracked by git)
├── .gitignore # Git ignore rules
├── firebase-credentials.json # Firebase admin credentials (not tracked by git)
├── static/
│ ├── css/ # Stylesheets
│ ├── js/
│ │ ├── pomodoro.js # Timer functionality
│ │ └── firebase-config.js # Firebase config (not tracked by git)
│ └── images/ # Static images
└── templates/
├── index.html # Landing page
├── login.html # Login page
├── register.html # Registration page
└── pomodoro.html # Main timer interface


## Running the Application

1. Ensure your virtual environment is activated
2. Start the Flask application:
```bash
python app.py
```
3. Open your browser and visit `http://localhost:5000`

## Security Notes

- Never commit sensitive files:
  - `firebase-credentials.json`
  - `firebase-config.js`
  - `.env`
- Keep your Firebase credentials secure
- Use environment variables for sensitive data
- Regularly update dependencies for security patches

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request



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

Add to ChatCtrl+L
Ctrl+K to generate a command
Flask==2.0.1
firebase-admin==5.0.3
python-dotenv==0.19.0
Flask-Session==0.5.0
Werkzeug==2.0.1 


now wht if i paste this also in tht new req.txt

I would NOT recommend mixing the old and new versions in the same requirements.txt file. Here's why:
Version Conflicts: Having two different versions of the same package (like Flask 2.0.1 and 3.0.0) will cause conflicts
Dependency Issues: Some packages might not work together if their versions are incompatible
Installation Problems: When someone tries to install dependencies, pip will get confused about which version to use
You should choose ONE set of versions. Since you're currently using the newer versions in your working environment (as shown by your pip freeze output), I recommend sticking with the newer versions:
Apply
This is better because:
These are the versions that are currently working in your environment
They include newer security updates and bug fixes
They're compatible with each other
They include additional packages your project is actually using (like Flask-Mail and Flask-SQLAlchemy)
If you're concerned about compatibility, you can test the installation in a fresh virtual environment:
Apply
Run
Would you like to proceed with the newer versions, or do you have a specific reason for wanting to use the older versions?
i want a Readme.md description where it tells about the app and how to run the and all to be explained in this txt

I'll help you create a comprehensive README.md file. First, let me check your project structure to better understand what to include.
Based on your project, I'll create a comprehensive README.md file. Here's what I suggest:
Apply
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
Apply
├── app.py # Main application file
├── requirements.txt # Python dependencies
├── firebase-credentials.json # Firebase configuration
├── static/ # Static files (CSS, JS, images)
├── templates/ # HTML templates
└── .env # Environment variables
Apply
This README.md provides:
A clear description of your application
Installation instructions
Setup requirements
How to run the application
Usage instructions
Project structure
Technologies used
Contributing guidelines
Would you like me to modify any section or add more specific information about certain features?
hint: See the 'Note about fast-forwards' in 'git push --help' for details.
(venv) PS C:\Users\Admin\OneDrive\Desktop\APP2 - Copy> git add .
(venv) PS C:\Users\Admin\OneDrive\Desktop\APP2 - Copy> git commit -m "readme.md updated"
[main 84a558d] readme.md updated
 1 file changed, 110 insertions(+), 1 deletion(-)
(venv) PS C:\Users\Admin\OneDrive\Desktop\APP2 - Copy> git push origin main
To https://github.com/NixyCodes/Focus-Flow.git
 ! [rejected]        main -> main (fetch first)
error: failed to push some refs to 'https://github.com/NixyCodes/Focus-Flow.git'
hint: Updates were rejected because the remote contains work that you do not
hint: have locally. This is usually caused by another repository pushing to
hint: the same ref. If you want to integrate the remote changes, use
hint: 'git pull' before pushing again.
hint: See the 'Note about fast-forwards' in 'git push --help' for details.

This error occurs because there are changes in the remote repository (on GitHub) that you don't have in your local repository. Here's how to fix it:
First, pull the remote changes and merge them with your local changes:
Apply
Run
If there are any merge conflicts, you'll need to resolve them. After resolving any conflicts:
Then try pushing again:
Apply
Run
If you're absolutely sure you want to overwrite what's on GitHub with your local version (be careful with this!), you can force push:
Apply
Run
However, I recommend using the first approach (git pull then push) because:
It's safer
It preserves any changes that might have been made by others
It maintains the commit history
Would you like to try the git pull approach first? If you run into any merge conflicts, I can help you resolve them.
i have also git igorned the firebase-config.js file

That's a good security practice! You should also add firebase-credentials.json to your .gitignore file since it contains sensitive information. Let me help you set up a proper .gitignore file for your Python/Flask project.
Here's what you should add to your .gitignore file:
Apply
To create/update your .gitignore file:
Create or open .gitignore in your project root
Add the above content
Save the file
Then run:
Apply
Run
This will ensure that:
Your Firebase credentials are not exposed
Sensitive configuration files are kept private
Python cache files and virtual environment are ignored
IDE-specific files are ignored
System files are ignored
Would you like me to explain why each of these entries is important, or would you like to proceed with updating your .gitignore file?
update the read me 

I'll update the README.md to include information about the .gitignore setup and make it more specific to your project. Here's the updated version:
Apply
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



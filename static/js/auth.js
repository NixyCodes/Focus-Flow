// Firebase Auth
const auth = firebase.auth();

// Check if we're on the login or register page
const isLoginPage = document.getElementById('login-form');
const isRegisterPage = document.getElementById('register-form');

// Handle Login
if (isLoginPage) {
    isLoginPage.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            // Redirect to pomodoro page after successful login
            window.location.href = '/pomodoro';
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });
}

// Handle Registration
if (isRegisterPage) {
    isRegisterPage.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            // Redirect to pomodoro page after successful registration
            window.location.href = '/pomodoro';
        } catch (error) {
            alert('Registration failed: ' + error.message);
        }
    });
}

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
    } else {
        // User is signed out
        console.log('User is signed out');
    }
}); 
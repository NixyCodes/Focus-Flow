// DOM Elements
const loginBtn = document.getElementById('login-btn');
const getStartedBtn = document.getElementById('get-started');
const authModal = document.getElementById('auth-modal');
const closeModal = document.querySelector('.close');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const authContainer = document.getElementById('auth-container');
const registerContainer = document.getElementById('register-container');
const pomodoroContainer = document.getElementById('pomodoro-container');
const timeDisplay = document.getElementById('time');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const sessionCount = document.getElementById('session-count');
const statusDisplay = document.getElementById('status');

// Timer variables
let timeLeft = 25 * 60; // 25 minutes in seconds
let timerId = null;
let isRunning = false;
let sessions = 0;
let isWorkTime = true;

// Firebase Auth
const auth = firebase.auth();

// Modal Functions
function openModal() {
    authModal.style.display = 'block';
}

function closeModalFunc() {
    authModal.style.display = 'none';
}

function showRegister() {
    authContainer.style.display = 'none';
    registerContainer.style.display = 'block';
}

function showLogin() {
    registerContainer.style.display = 'none';
    authContainer.style.display = 'block';
}

// Event Listeners for Modal
loginBtn.addEventListener('click', openModal);
getStartedBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
window.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeModalFunc();
    }
});

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    showRegister();
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLogin();
});

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        closeModalFunc();
        document.querySelector('.hero-section').style.display = 'none';
        document.querySelector('.features-section').style.display = 'none';
        document.querySelector('.navbar').style.display = 'none';
        pomodoroContainer.style.display = 'block';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
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
        closeModalFunc();
        document.querySelector('.hero-section').style.display = 'none';
        document.querySelector('.features-section').style.display = 'none';
        document.querySelector('.navbar').style.display = 'none';
        pomodoroContainer.style.display = 'block';
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
});

// Timer functions
function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay();
            
            if (timeLeft === 0) {
                clearInterval(timerId);
                isRunning = false;
                
                if (isWorkTime) {
                    sessions++;
                    sessionCount.textContent = sessions;
                    if (sessions % 4 === 0) {
                        timeLeft = 15 * 60; // Long break
                        statusDisplay.textContent = 'Long Break';
                    } else {
                        timeLeft = 5 * 60; // Short break
                        statusDisplay.textContent = 'Break';
                    }
                } else {
                    timeLeft = 25 * 60; // Work time
                    statusDisplay.textContent = 'Work';
                }
                
                isWorkTime = !isWorkTime;
                updateDisplay();
                playNotification();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timerId);
        isRunning = false;
    }
}

function resetTimer() {
    clearInterval(timerId);
    isRunning = false;
    timeLeft = 25 * 60;
    isWorkTime = true;
    statusDisplay.textContent = 'Work';
    updateDisplay();
}

function playNotification() {
    const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
    audio.play();
}

// Event listeners for timer
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize display
updateDisplay(); 
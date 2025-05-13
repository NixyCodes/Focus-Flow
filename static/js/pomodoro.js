// Initialize Firestore
const db = firebase.firestore();
const auth = firebase.auth();

// Timer state
let timerState = {
    isRunning: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    mode: 'work', // 'work', 'shortBreak', or 'longBreak'
    sessionCount: 0,
    totalTime: 0,
    completedPomodoros: 0,
    totalBreaks: 0,
    settings: {
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        longBreakInterval: 4,
        soundEnabled: true
    }
};

// Notification state
let notificationPermission = false;

// Request notification permission and initialize app when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    try {
        if (!("Notification" in window)) {
            console.log("This browser does not support notifications");
            return;
        }

        if (Notification.permission === "granted") {
            notificationPermission = true;
        } else if (Notification.permission !== "denied") {
            const permission = await Notification.requestPermission();
            notificationPermission = permission === "granted";
        }
    } catch (error) {
        console.error("Error requesting notification permission:", error);
    }

    // DOM Elements
    const timerDisplay = document.getElementById('timer-display');
    const modeIndicator = document.getElementById('mode-indicator');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const sessionCount = document.getElementById('session-count');
    const sessionProgress = document.getElementById('session-progress');
    const totalTime = document.getElementById('total-time');
    const completedPomodoros = document.getElementById('completed-pomodoros');
    const totalBreaks = document.getElementById('total-breaks');

    // Settings Modal Elements
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const cancelSettings = document.getElementById('cancel-settings');
    const saveSettings = document.getElementById('save-settings');
    const workDurationInput = document.getElementById('work-duration');
    const shortBreakInput = document.getElementById('short-break');
    const longBreakInput = document.getElementById('long-break');
    const longBreakIntervalInput = document.getElementById('long-break-interval');
    const soundEnabledInput = document.getElementById('sound-enabled');

    // Check authentication state
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            sessionStorage.setItem('user_id', user.uid);
            loadSettings();
        } else {
            // User is signed out
            window.location.href = '/login';
        }
    });

    // Timer functions
    function updateDisplay() {
        const minutes = Math.floor(timerState.timeLeft / 60);
        const seconds = timerState.timeLeft % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update progress bar
        const totalDuration = timerState.mode === 'work' ? timerState.settings.workDuration * 60 :
                             timerState.mode === 'shortBreak' ? timerState.settings.shortBreak * 60 :
                             timerState.settings.longBreak * 60;
        const progress = ((totalDuration - timerState.timeLeft) / totalDuration) * 100;
        sessionProgress.style.width = `${progress}%`;
    }

    function showNotification(title, body) {
        if (!notificationPermission) {
            console.log("Notification permission not granted");
            return;
        }

        try {
            const notification = new Notification(title, {
                body: body,
                icon: '/static/images/icon.png',
                requireInteraction: true, // Notification will stay until user interacts
                silent: false // Ensure sound plays
            });

            // Handle notification click
            notification.onclick = function() {
                window.focus();
                this.close();
            };

            // Auto close after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);
        } catch (error) {
            console.error("Error showing notification:", error);
        }
    }

    // Function to record a session
    async function recordSession() {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('No user logged in');
                return;
            }

            const sessionData = {
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                duration: timerState.mode === 'work' ? timerState.settings.workDuration :
                         timerState.mode === 'shortBreak' ? timerState.settings.shortBreak :
                         timerState.settings.longBreak,
                type: timerState.mode === 'work' ? 'Work' :
                      timerState.mode === 'shortBreak' ? 'Short Break' : 'Long Break',
                notes: '' // Optional: Add a way for users to add notes
            };

            await db.collection('users').doc(user.uid).collection('sessions').add(sessionData);
            console.log('Session recorded successfully');
        } catch (error) {
            console.error('Error recording session:', error);
        }
    }

    function switchMode() {
        if (timerState.mode === 'work') {
            timerState.completedPomodoros++;
            completedPomodoros.textContent = timerState.completedPomodoros;
            timerState.sessionCount++;
            
            // Record the completed work session
            recordSession();
            
            if (timerState.sessionCount % timerState.settings.longBreakInterval === 0) {
                timerState.mode = 'longBreak';
                timerState.timeLeft = timerState.settings.longBreak * 60;
                modeIndicator.textContent = 'Long Break';
                showNotification('Long Break Time! 🎉', 'Take a longer break to recharge. You\'ve completed ' + timerState.sessionCount + ' work sessions!');
            } else {
                timerState.mode = 'shortBreak';
                timerState.timeLeft = timerState.settings.shortBreak * 60;
                modeIndicator.textContent = 'Short Break';
                showNotification('Short Break Time! ☕', 'Take a quick break. You\'ve completed ' + timerState.sessionCount + ' work sessions!');
            }
            timerState.totalBreaks++;
            totalBreaks.textContent = timerState.totalBreaks;
        } else {
            timerState.mode = 'work';
            timerState.timeLeft = timerState.settings.workDuration * 60;
            modeIndicator.textContent = 'Work Time';
            showNotification('Back to Work! 💪', 'Break is over. Time to focus on your tasks!');
            
            // Record the completed break session
            recordSession();
        }
        
        sessionCount.textContent = `${timerState.sessionCount}/${timerState.settings.longBreakInterval}`;
        updateDisplay();
        
        // Play sound notification
        if (timerState.settings.soundEnabled) {
            try {
                window.createBeepSound();
            } catch (error) {
                console.error('Error playing sound:', error);
            }
        }

        // Send email notification
        fetch('/api/notify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                mode: timerState.mode
            })
        }).catch(error => {
            console.error('Error sending notification:', error);
        });
    }

    let timerInterval;

    function startTimer() {
        if (!timerState.isRunning) {
            timerState.isRunning = true;
            startBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');
            
            // Start playing background music
            if (typeof window.playBackgroundMusic === 'function') {
                window.playBackgroundMusic();
            }
            
            timerInterval = setInterval(() => {
                timerState.timeLeft--;
                if (timerState.mode === 'work') {
                    timerState.totalTime++;
                    totalTime.textContent = `${Math.floor(timerState.totalTime / 60)} minutes`;
                }
                
                updateDisplay();
                
                if (timerState.timeLeft <= 0) {
                    switchMode();
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        if (timerState.isRunning) {
            timerState.isRunning = false;
            clearInterval(timerInterval);
            startBtn.classList.remove('hidden');
            pauseBtn.classList.add('hidden');
            
            // Pause background music
            if (typeof window.pauseBackgroundMusic === 'function') {
                window.pauseBackgroundMusic();
            }
        }
    }

    function resetTimer() {
        pauseTimer();
        timerState.timeLeft = timerState.settings.workDuration * 60;
        timerState.mode = 'work';
        timerState.sessionCount = 0;
        modeIndicator.textContent = 'Work Time';
        sessionCount.textContent = `0/${timerState.settings.longBreakInterval}`;
        updateDisplay();
        
        // Stop background music
        if (typeof window.stopBackgroundMusic === 'function') {
            window.stopBackgroundMusic();
        }
    }

    // Settings functions
    function loadSettings() {
        const user = auth.currentUser;
        if (user) {
            db.collection('users').doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists && doc.data().settings) {
                        timerState.settings = doc.data().settings;
                        updateSettingsUI();
                    }
                })
                .catch((error) => {
                    console.error("Error loading settings:", error);
                });
        }
    }

    function saveSettingsToFirestore() {
        const user = auth.currentUser;
        if (user) {
            db.collection('users').doc(user.uid).update({
                settings: timerState.settings
            }).catch((error) => {
                console.error("Error saving settings:", error);
            });
        }
    }

    function updateSettingsUI() {
        workDurationInput.value = timerState.settings.workDuration;
        shortBreakInput.value = timerState.settings.shortBreak;
        longBreakInput.value = timerState.settings.longBreak;
        longBreakIntervalInput.value = timerState.settings.longBreakInterval;
        soundEnabledInput.checked = timerState.settings.soundEnabled;
    }

    // Event Listeners
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Settings Modal Event Listeners
    settingsBtn.addEventListener('click', () => {
        settingsModal.classList.remove('hidden');
        updateSettingsUI();
    });

    closeSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    cancelSettings.addEventListener('click', () => {
        settingsModal.classList.add('hidden');
    });

    saveSettings.addEventListener('click', () => {
        timerState.settings.workDuration = parseInt(workDurationInput.value);
        timerState.settings.shortBreak = parseInt(shortBreakInput.value);
        timerState.settings.longBreak = parseInt(longBreakInput.value);
        timerState.settings.longBreakInterval = parseInt(longBreakIntervalInput.value);
        timerState.settings.soundEnabled = soundEnabledInput.checked;
        saveSettingsToFirestore();
        settingsModal.classList.add('hidden');
        resetTimer();
    });

    // Logout functionality
    document.getElementById('logout-btn').addEventListener('click', () => {
        window.location.href = '/api/logout';
    });

    // Initialize
    updateDisplay();
}); 
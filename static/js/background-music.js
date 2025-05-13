// Background music functionality
let backgroundMusic = null;

// Create audio element
function createAudio() {
    const audio = new Audio();
    audio.src = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'; // Using a reliable test audio
    audio.loop = true;
    audio.volume = 0.5;
    return audio;
}

// Initialize audio
function initAudio() {
    if (!backgroundMusic) {
        backgroundMusic = createAudio();
        // Preload the audio
        backgroundMusic.load();
    }
}

// Play audio
function playAudio() {
    if (!backgroundMusic) {
        initAudio();
    }
    
    // Play the audio
    const playPromise = backgroundMusic.play();
    
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // If autoplay is blocked, try to play after user interaction
            document.addEventListener('click', function playOnClick() {
                backgroundMusic.play();
                document.removeEventListener('click', playOnClick);
            }, { once: true });
        });
    }
}

// Pause audio
function pauseAudio() {
    if (backgroundMusic) {
        backgroundMusic.pause();
    }
}

// Stop audio
function stopAudio() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initAudio);

// Export functions
window.playBackgroundMusic = playAudio;
window.pauseBackgroundMusic = pauseAudio;
window.stopBackgroundMusic = stopAudio; 
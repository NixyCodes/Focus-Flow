// Particle and Animation Effects for FocusFlow
document.addEventListener('DOMContentLoaded', function() {
  // Create floating particles
  const container = document.body;
  for (let i = 0; i < 15; i++) {
    createParticle(container);
  }
  
  function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position, size and animation duration
    const size = Math.random() * 15 + 5;
    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    const duration = Math.random() * 10 + 10;
    
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${posX}px`;
    particle.style.bottom = `${posY}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animation = `float ${duration}s infinite linear`;
    
    container.appendChild(particle);
  }
  
  // Add timer progress bar
  const timerCard = document.querySelector('#timer-display').parentNode;
  const progressContainer = document.createElement('div');
  progressContainer.className = 'timer-progress-container';
  const progressBar = document.createElement('div');
  progressBar.className = 'timer-progress-bar';
  progressContainer.appendChild(progressBar);
  timerCard.appendChild(progressContainer);
  
  // Add pulse animation to timer when active
  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('start-btn');
  const pauseBtn = document.getElementById('pause-btn');
  
  if(startBtn) {
    startBtn.addEventListener('click', function() {
      timerDisplay.classList.add('pulse-animation');
      animateProgressBar();
    });
  }
  
  if(pauseBtn) {
    pauseBtn.addEventListener('click', function() {
      timerDisplay.classList.remove('pulse-animation');
      stopProgressAnimation();
    });
  }
  
  // Add animation when mode changes
  const modeIndicator = document.getElementById('mode-indicator');
  if(modeIndicator) {
    const originalUpdateModeIndicator = window.updateModeIndicator || function() {};
    
    window.updateModeIndicator = function(mode) {
      modeIndicator.classList.add('mode-change');
      
      setTimeout(() => {
        modeIndicator.classList.remove('mode-change');
        if(typeof originalUpdateModeIndicator === 'function') {
          originalUpdateModeIndicator(mode);
        }
      }, 400);
    };
  }
  
  // Add Settings Modal Animation
  const settingsBtn = document.getElementById('settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const closeSettings = document.getElementById('close-settings');
  const cancelSettings = document.getElementById('cancel-settings');
  
  if(settingsBtn && settingsModal) {
    settingsBtn.addEventListener('click', function() {
      settingsModal.classList.remove('hidden');
      settingsModal.classList.add('active');
      
      const modalContent = settingsModal.querySelector('.bg-white');
      if(modalContent) {
        setTimeout(() => {
          modalContent.classList.add('modal-animation', 'visible');
          modalContent.classList.remove('hidden');
        }, 10);
      }
    });
  }
  
  if((closeSettings || cancelSettings) && settingsModal) {
    const closeModal = function() {
      const modalContent = settingsModal.querySelector('.bg-white');
      if(modalContent) {
        modalContent.classList.add('modal-animation', 'hidden');
        modalContent.classList.remove('visible');
      }
      
      setTimeout(() => {
        settingsModal.classList.remove('active');
        settingsModal.classList.add('hidden');
      }, 300);
    };
    
    if(closeSettings) closeSettings.addEventListener('click', closeModal);
    if(cancelSettings) cancelSettings.addEventListener('click', closeModal);
  }
  
  // Progress bar animation
  let progressInterval;
  function animateProgressBar() {
    const progressBar = document.querySelector('.timer-progress-bar');
    if(!progressBar) return;
    
    // Reset progress
    progressBar.style.width = '0%';
    
    // Get timer duration in seconds
    let totalDuration = 25 * 60; // Default 25 minutes in seconds
    const timerText = timerDisplay.textContent.split(':');
    if(timerText.length === 2) {
      totalDuration = parseInt(timerText[0]) * 60 + parseInt(timerText[1]);
    }
    
    const startTime = Date.now();
    const endTime = startTime + (totalDuration * 1000);
    
    stopProgressAnimation();
    
    progressInterval = setInterval(() => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const remaining = endTime - currentTime;
      
      if(remaining <= 0) {
        progressBar.style.width = '100%';
        stopProgressAnimation();
        showCelebration();
        return;
      }
      
      const progress = (elapsed / (totalDuration * 1000)) * 100;
      progressBar.style.width = `${progress}%`;
    }, 1000);
  }
  
  function stopProgressAnimation() {
    if(progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }
  
  // Celebration effect when timer completes
  function showCelebration() {
    const celebration = document.createElement('div');
    celebration.className = 'celebration';
    document.body.appendChild(celebration);
    
    setTimeout(() => {
      celebration.style.opacity = '0.3';
      setTimeout(() => {
        document.body.removeChild(celebration);
      }, 500);
    }, 500);
  }
  
  // Make cards animate on page load
  const cards = document.querySelectorAll('.bg-white');
  cards.forEach((card, index) => {
    card.classList.add('slide-up');
    card.style.animationDelay = `${index * 0.1}s`;
  });
  
  // Smooth hover effect for all buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('mouseover', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    button.addEventListener('mouseout', function() {
      this.style.transform = 'translateY(0)';
    });
  });
});
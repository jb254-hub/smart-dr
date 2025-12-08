        // Countdown Timer
        function updateCountdown() {
            // Set the target date (7 days from now)
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 7);
            targetDate.setHours(10, 0, 0, 0); // Set to 10:00 AM
            
            const now = new Date().getTime();
            const timeLeft = targetDate - now;
            
            // Calculate days, hours, minutes, seconds
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            // Update the display
            document.getElementById('days').textContent = days.toString().padStart(2, '0');
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            
            // If the countdown is finished
            if (timeLeft < 0) {
                clearInterval(countdownInterval);
                document.querySelector('.countdown h3').textContent = "Update Released!";
                document.querySelector('.timer').innerHTML = '<div style="font-size: 1.5rem; color: #4b6cb7; padding: 20px;">The medication tools are now available! 🎉</div>';
            }
        }
        
        // Initialize countdown
        updateCountdown();
        const countdownInterval = setInterval(updateCountdown, 1000);
        
        // Notify Button Interaction
        document.getElementById('notifyBtn').addEventListener('click', function() {
            const button = this;
            const originalText = button.innerHTML;
            
            // Change button text and style
            button.innerHTML = '<i class="fas fa-check"></i> You\'ll Be Notified!';
            button.style.background = 'linear-gradient(to right, #2ecc71, #27ae60)';
            
            // Create confetti effect
            createConfetti();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = 'linear-gradient(to right, #4b6cb7, #182848)';
            }, 3000);
        });
        
        // Confetti effect function
        function createConfetti() {
            const colors = ['#ff6b6b', '#4b6cb7', '#2ecc71', '#f39c12', '#9b59b6'];
            const card = document.querySelector('.notification-card');
            
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.left = Math.random() * 100 + '%';
                confetti.style.top = '-20px';
                confetti.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
                card.appendChild(confetti);
                
                // Animate confetti
                const animationDuration = Math.random() * 2 + 1;
                const animationDelay = Math.random() * 0.5;
                
                confetti.style.animation = `
                    confettiFall ${animationDuration}s ease-out ${animationDelay}s forwards,
                    confettiRotate ${animationDuration}s linear ${animationDelay}s forwards
                `;
                
                // Remove confetti after animation
                setTimeout(() => {
                    confetti.remove();
                }, (animationDuration + animationDelay) * 1000);
            }
            
            // Add CSS for confetti animation
            if (!document.querySelector('#confetti-styles')) {
                const style = document.createElement('style');
                style.id = 'confetti-styles';
                style.textContent = `
                    @keyframes confettiFall {
                        0% { opacity: 1; transform: translateY(0) rotate(0deg); }
                        100% { opacity: 0; transform: translateY(500px) rotate(360deg); }
                    }
                    
                    @keyframes confettiRotate {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        // Feature cards hover effect enhancement
        const featureCards = document.querySelectorAll('.feature');
        featureCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.borderColor = '#4b6cb7';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.borderColor = '#e6e9ff';
            });
        });

          // Security shortcuts disabled
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  });

  document.addEventListener('keydown', function (e) {
    if (
      e.key === "F12" ||
      (e.ctrlKey && e.shiftKey && e.key === "I") ||
      (e.ctrlKey && e.key === "U")
    ) {
      e.preventDefault();
      alert("Action disabled");
    }
  });
    

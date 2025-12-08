
        document.addEventListener('DOMContentLoaded', function() {
            const privacyBadges = document.querySelectorAll('.privacy-badge');
            const dataSteps = document.querySelectorAll('.data-step');
            
            function checkScroll() {
                privacyBadges.forEach(badge => {
                    const badgeTop = badge.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (badgeTop < windowHeight - 100) {
                        badge.style.opacity = '1';
                        badge.style.transform = 'translateY(0)';
                    }
                });
                
                dataSteps.forEach(step => {
                    const stepTop = step.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (stepTop < windowHeight - 100) {
                        step.style.opacity = '1';
                        step.style.transform = 'translateY(0)';
                    }
                });
            }
            
            privacyBadges.forEach(badge => {
                badge.style.opacity = '0';
                badge.style.transform = 'translateY(20px)';
                badge.style.transition = 'opacity 0.5s, transform 0.5s';
            });
            
            dataSteps.forEach(step => {
                step.style.opacity = '0';
                step.style.transform = 'translateY(20px)';
                step.style.transition = 'opacity 0.5s, transform 0.5s';
            });
            
            window.addEventListener('scroll', checkScroll);
            checkScroll(); 
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

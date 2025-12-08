
        document.addEventListener('DOMContentLoaded', function() {
            const featureCards = document.querySelectorAll('.feature-card');
            
            function checkScroll() {
                featureCards.forEach(card => {
                    const cardTop = card.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (cardTop < windowHeight - 100) {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }
                });
            }
            
            featureCards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s, transform 0.5s';
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

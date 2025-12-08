   
        document.addEventListener('DOMContentLoaded', function() {
            const contactMethods = document.querySelectorAll('.contact-method');
            const faqItems = document.querySelectorAll('.faq-item');
            
            function checkScroll() {
                contactMethods.forEach(method => {
                    const methodTop = method.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (methodTop < windowHeight - 100) {
                        method.style.opacity = '1';
                        method.style.transform = 'translateY(0)';
                    }
                });
                
                faqItems.forEach(item => {
                    const itemTop = item.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (itemTop < windowHeight - 100) {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }
                });
            }
            
            contactMethods.forEach(method => {
                method.style.opacity = '0';
                method.style.transform = 'translateY(20px)';
                method.style.transition = 'opacity 0.5s, transform 0.5s';
            });
            
            faqItems.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = 'opacity 0.5s, transform 0.5s';
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
    

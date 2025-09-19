// Additional animations
document.addEventListener('DOMContentLoaded', function() {
    // Text wave animation
    const textWaveElements = document.querySelectorAll('.text-wave');
    textWaveElements.forEach(el => {
        const text = el.textContent;
        el.innerHTML = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.className = 'wave-letter';
            span.textContent = text[i];
            span.style.animationDelay = `${i * 0.1}s`;
            el.appendChild(span);
        }
    });

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animated');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on load

    // Hover effect for cards
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.03)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // Floating animation for elements
    const floatingElements = document.querySelectorAll('.floating-animation');
    floatingElements.forEach(el => {
        el.style.animationDelay = `${Math.random() * 2}s`;
    });

    // Gradient animation for buttons
    const gradientButtons = document.querySelectorAll('.btn-primary');
    gradientButtons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.animationPlayState = 'paused';
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.animationPlayState = 'running';
        });
    });

    // Scroll indicator animation
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
            });
        });
    }

    // Animate stats when about section is in view
    const aboutSection = document.querySelector('.about-section');
    if (aboutSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(aboutSection);
    }

    // Function to animate stats numbers
    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const increment = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(increment);
                } else {
                    stat.textContent = target;
                }
            };
            
            increment();
        });
    }
});
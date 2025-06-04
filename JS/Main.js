// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
            // Mostrar modal premium después del preloader
            showWelcomePremiumModal();
        }, 500);
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Toggle body overflow when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
}

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (hamburger) hamburger.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// Back to top button
const backToTopBtn = document.querySelector('.back-to-top');
if (backToTopBtn) {
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Accordion functionality
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (header) {
        header.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.accordion-item.active');
            
            // Close currently active item if it's not the one being clicked
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            
            // Toggle current item
            item.classList.toggle('active');
        });
    }
});

// FAQ functionality
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
        question.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            
            // Close currently active item if it's not the one being clicked
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            
            // Toggle current item
            item.classList.toggle('active');
        });
    }
});

// Tab functionality
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

if (tabs && tabContents) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.getAttribute('data-tab') === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

// Animate stats numbers
const animateStats = () => {
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
};

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Animate stats if it's the about section
            if (entry.target.classList.contains('about-section')) {
                animateStats();
            }
        }
    });
}, {
    threshold: 0.1
});

// Observe sections
document.querySelectorAll('.animate-on-scroll').forEach(section => {
    observer.observe(section);
});

if (document.getElementById('particles-js')) {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#6a5acd" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: true },
            line_linked: { enable: true, distance: 150, color: "#6a5acd", opacity: 0.4, width: 1 },
            move: { enable: true, speed: 3, direction: "none", random: true, straight: false, out_mode: "out" }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "repulse" },
                onclick: { enable: true, mode: "push" }
            }
        }
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Enviado';
            this.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = 'Enviar Mensaje';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Suscribiendo...';
        
        setTimeout(() => {
            submitBtn.innerHTML = '<i class="fas fa-check"></i> Suscrito';
            this.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = 'Suscribirse';
                submitBtn.disabled = false;
            }, 2000);
        }, 1500);
    });
}

// Funciones para el modal premium
function showWelcomePremiumModal() {
    const welcomeModal = document.getElementById('welcomePremiumModal');
    if (welcomeModal) {
        welcomeModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeWelcomePremiumModal() {
    const welcomeModal = document.getElementById('welcomePremiumModal');
    if (welcomeModal) {
        welcomeModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Configurar cierre del modal premium
    const closeButton = document.getElementById('closeWelcomeModal');
    const welcomeModal = document.getElementById('welcomePremiumModal');
    
    if (closeButton) {
        closeButton.addEventListener('click', closeWelcomePremiumModal);
    }
    
    if (welcomeModal) {
        welcomeModal.addEventListener('click', function(e) {
            if (e.target === welcomeModal) {
                closeWelcomePremiumModal();
            }
        });
    }
    
    // Elementos del menú de usuario
    const userMenuTrigger = document.getElementById('userMenuTrigger');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    const authActionBtn = document.getElementById('authActionBtn');
    const profileOption = document.getElementById('profileOption');
    const premiumFeatures = document.querySelectorAll('.premium-feature');
    
    // Alternar menú desplegable
    if (userMenuTrigger) {
        userMenuTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('show');
        });
    }
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (userMenuTrigger && userMenuDropdown) {
            if (!userMenuTrigger.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.classList.remove('show');
            }
        }
    });
    
    // Manejar clic en "Mi perfil"
    if (profileOption) {
        profileOption.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = 'profile.html';
        });
    }
    
    // Manejar clic en características premium
    if (premiumFeatures) {
        premiumFeatures.forEach(feature => {
            feature.addEventListener('click', function(e) {
                e.preventDefault();
                const isAuthenticated = false;
                const isPremium = false;
                
                if (!isAuthenticated) {
                    alert('Por favor inicia sesión para acceder a esta función');
                } else if (!isPremium) {
                    alert('Esta función requiere una suscripción premium');
                } else {
                    const featurePage = this.getAttribute('data-feature') + '.html';
                    window.location.href = featurePage;
                }
            });
        });
    }
    
    // Botón de autenticación
    if (authActionBtn) {
        authActionBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const isAuthenticated = false;
            
            if (isAuthenticated) {
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('authToken');
                location.reload();
            } else {
                window.location.href = 'login.html';
            }
        });
    }
    
    // Función para verificar estado de autenticación
    function checkAuthState() {
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const authActionBtn = document.getElementById('authActionBtn');
        const userMenuContainer = document.querySelector('.user-menu-container');
        
        if (authToken) {
            if (authActionBtn) {
                authActionBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar sesión';
            }
            
            if (userMenuContainer) userMenuContainer.classList.add('user-logged-in');
            
            const userData = JSON.parse(localStorage.getItem('userData')) || {
                name: 'Usuario',
                email: 'usuario@ejemplo.com'
            };
            
            if (document.getElementById('userName')) {
                document.getElementById('userName').textContent = userData.name;
            }
            if (document.getElementById('userEmail')) {
                document.getElementById('userEmail').textContent = userData.email;
            }
            
            return true;
        } else {
            if (authActionBtn) {
                authActionBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar sesión';
            }
            
            if (userMenuContainer) userMenuContainer.classList.remove('user-logged-in');
            if (document.getElementById('userName')) {
                document.getElementById('userName').textContent = 'Invitado';
            }
            if (document.getElementById('userEmail')) {
                document.getElementById('userEmail').textContent = 'No has iniciado sesión';
            }
            
            return false;
        }
    }
    
    // Iniciar verificación de autenticación
    checkAuthState();
});
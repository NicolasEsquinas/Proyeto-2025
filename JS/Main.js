// Preloader
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    preloader.style.opacity = '0';
    setTimeout(() => {
        preloader.style.display = 'none';
    }, 500);
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

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

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
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
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Back to top button
const backToTopBtn = document.querySelector('.back-to-top');
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

// Accordion functionality
const accordionItems = document.querySelectorAll('.accordion-item');
accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    
    header.addEventListener('click', () => {
        const currentlyActive = document.querySelector('.accordion-item.active');
        
        // Close currently active item if it's not the one being clicked
        if (currentlyActive && currentlyActive !== item) {
            currentlyActive.classList.remove('active');
        }
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// FAQ functionality
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
        const currentlyActive = document.querySelector('.faq-item.active');
        
        // Close currently active item if it's not the one being clicked
        if (currentlyActive && currentlyActive !== item) {
            currentlyActive.classList.remove('active');
        }
        
        // Toggle current item
        item.classList.toggle('active');
    });
});

// Tab functionality
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

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
// main.js (actualizado)

// ... (código existente previo)

// Añadir al final del archivo existente:

// Manejo del menú de usuario (versión mejorada)
document.addEventListener('DOMContentLoaded', function() {
    const userMenuTrigger = document.getElementById('userMenuTrigger');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    
    if (userMenuTrigger && userMenuDropdown) {
        userMenuTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('show');
            
            // Rotar la flecha
            const chevron = this.querySelector('.fa-chevron-down');
            chevron.style.transform = userMenuDropdown.classList.contains('show') 
                ? 'rotate(180deg)' 
                : 'rotate(0deg)';
        });
        
        // Cerrar menú al hacer clic en cualquier parte del documento
        document.addEventListener('click', function(e) {
            if (!userMenuTrigger.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                userMenuDropdown.classList.remove('show');
                const chevron = userMenuTrigger.querySelector('.fa-chevron-down');
                chevron.style.transform = 'rotate(0deg)';
            }
        });
    }
    
    // Manejo del logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Eliminar datos de sesión
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            sessionStorage.removeItem('authToken');
            
            // Redirigir a home
            window.location.href = 'index.html';
        });
    }
    
    // Verificar estado de autenticación
    function checkAuthState() {
        const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const userMenu = document.getElementById('userMenuContainer');
        const loginLink = document.getElementById('loginLink');
        const registerLink = document.getElementById('registerLink');
        
        if (authToken) {
            // Usuario logueado
            if (userMenu) userMenu.style.display = 'block';
            if (loginLink) loginLink.style.display = 'none';
            if (registerLink) registerLink.style.display = 'none';
            
            // Cargar datos del usuario
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData && document.getElementById('userName')) {
                document.getElementById('userName').textContent = userData.name || 'Usuario';
                document.getElementById('userEmail').textContent = userData.email || 'usuario@ejemplo.com';
            }
        } else {
            // Usuario no logueado
            if (userMenu) userMenu.style.display = 'none';
            if (loginLink) loginLink.style.display = 'block';
            if (registerLink) registerLink.style.display = 'block';
        }
    }
    
    // Ejecutar al cargar
    checkAuthState();
});
function checkAuthState() {
    const authToken = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const userMenu = document.getElementById('userMenuContainer');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    
    if (authToken) {
        // Usuario logueado - mostrar menú de usuario
        if (userMenu) userMenu.style.display = 'block';
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        
        // Cargar datos del usuario
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userEmail').textContent = userData.email;
            document.getElementById('headerAvatar').src = userData.avatar || 'images/doctor-avatar.png';
            document.getElementById('dropdownAvatar').src = userData.avatar || 'images/doctor-avatar.png';
        }
    } else {
        // Usuario no logueado - mostrar botones de login/register
        if (userMenu) userMenu.style.display = 'none';
        if (loginLink) loginLink.style.display = 'block';
        if (registerLink) registerLink.style.display = 'block';
    }
}

// Manejar el menú desplegable
if (document.getElementById('userMenuTrigger')) {
    const userMenuTrigger = document.getElementById('userMenuTrigger');
    const userMenuDropdown = document.getElementById('userMenuDropdown');
    
    userMenuTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        userMenuDropdown.classList.toggle('show');
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function() {
        userMenuDropdown.classList.remove('show');
    });
}

// Manejar logout
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Eliminar datos de sesión
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('authToken');
        
        // Redirigir a home y recargar
        window.location.href = 'index.html';
    });
}

// Verificar estado al cargar
document.addEventListener('DOMContentLoaded', function() {
    checkAuthState();
    
    // Actualizar cada vez que cambia el almacenamiento (por si se hace login en otra pestaña)
    window.addEventListener('storage', function() {
        checkAuthState();
    });
});
// Código de depuración (añádelo al final de main.js)
console.log("Script cargado");

const userMenuTrigger = document.getElementById('userMenuTrigger');
const userMenuDropdown = document.getElementById('userMenuDropdown');

if (userMenuTrigger) {
    console.log("Elemento userMenuTrigger encontrado");
    userMenuTrigger.addEventListener('click', function() {
        console.log("Clic en userMenuTrigger");
        if (userMenuDropdown) {
            console.log("Mostrando/ocultando menú");
            userMenuDropdown.classList.toggle('show');
        }
    });
} else {
    console.error("Elemento userMenuTrigger NO encontrado");
}

if (!userMenuDropdown) {
    console.error("Elemento userMenuDropdown NO encontrado");
}
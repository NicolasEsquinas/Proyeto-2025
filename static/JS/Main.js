

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
// CONFIGURACIÓN DE CLOUDINARY
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload';
const CLOUDINARY_PRESET = 'preset_de_cloudinary';

// ELEMENTOS
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imagePreview = document.getElementById('imagePreview');
const previewImage = document.getElementById('previewImage');
const retakeBtn = document.getElementById('retakeBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const analysisProgress = document.getElementById('analysisProgress');
const analysisResults = document.getElementById('analysisResults');
const confidenceFill = document.querySelector('.confidence-fill');
const confidenceValue = document.querySelector('.confidence-value');

const stepElements = document.querySelectorAll('.detection-steps .step');

// CONTROL DE PASOS
function setStep(step) {
    stepElements.forEach(el => {
        el.classList.remove('active');
        if (parseInt(el.dataset.step) === step) {
            el.classList.add('active');
        }
    });
}

// EVENTO DE DRAG & DROP
uploadArea.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', e => {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
});
uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('drag-over');
});
uploadArea.addEventListener('drop', e => {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
});

fileInput.addEventListener('change', e => {
    handleFile(e.target.files[0]);
});

retakeBtn.addEventListener('click', resetUpload);

analyzeBtn.addEventListener('click', startAnalysis);

document.getElementById('newAnalysisBtn').addEventListener('click', resetUpload);

function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
        previewImage.src = e.target.result;
        imagePreview.style.display = 'block';
        uploadArea.style.display = 'none';
    };
    reader.readAsDataURL(file);

    uploadToCloudinary(file);
}

async function uploadToCloudinary(file) {
    setStep(2);  // Paso 2 - Análisis IA (visual)
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);

    try {
        const res = await fetch(CLOUDINARY_URL, {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        console.log('Imagen subida a Cloudinary:', data.secure_url);
        previewImage.dataset.imageUrl = data.secure_url;  // Guardar URL para análisis IA
    } catch (error) {
        alert('Error al subir la imagen.');
    }
}

function resetUpload() {
    imagePreview.style.display = 'none';
    analysisProgress.style.display = 'none';
    analysisResults.style.display = 'none';
    uploadArea.style.display = 'flex';
    setStep(1);
}

// Simulación del análisis
async function startAnalysis() {
    setStep(2);
    analysisProgress.style.display = 'flex';
    imagePreview.style.display = 'none';

    await animateProgress();

    await analyzeWithIA(previewImage.dataset.imageUrl);
}

// Animación de progreso IA (simulada)
function animateProgress() {
    return new Promise(resolve => {
        const circle = document.querySelector('.progress-ring-circle');
        const percentText = document.querySelector('.progress-percent');
        let progress = 0;
        circle.style.stroke = '#00c4ff';
        circle.style.strokeDasharray = '327';  // 2 * π * r
        circle.style.strokeDashoffset = '327';

        const interval = setInterval(() => {
            progress += 2;
            if (progress > 100) {
                clearInterval(interval);
                resolve();
                return;
            }
            const offset = 327 - (327 * progress) / 100;
            circle.style.strokeDashoffset = offset;
            percentText.textContent = progress + '%';
        }, 40);
    });
}

// Llamada real a la IA
async function analyzeWithIA(imageUrl) {
    try {
        const res = await fetch('/api/analisis-ia', {
            method: 'POST',
            body: JSON.stringify({ imageUrl }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();

        renderResults(data);
    } catch (error) {
        alert('Error al analizar la imagen.');
    }
}

function renderResults(data) {
    setStep(3);

    analysisProgress.style.display = 'none';
    analysisResults.style.display = 'block';

    confidenceFill.style.width = data.probabilidad + '%';
    confidenceValue.textContent = data.probabilidad + '%';

    const resultTitle = analysisResults.querySelector('.result-card.primary h4');
    const resultDescription = analysisResults.querySelector('.result-card.primary p');
    const severityBar = analysisResults.querySelectorAll('.stat-fill')[0];
    const inflammationBar = analysisResults.querySelectorAll('.stat-fill')[1];

    resultTitle.textContent = data.diagnostico || 'Diagnóstico';
    resultDescription.textContent = 'Probabilidad alta basada en las características visuales';

    severityBar.style.width = data.severidadPorcentaje + '%';
    inflammationBar.style.width = data.inflamacionPorcentaje + '%';

    const recommendationsList = analysisResults.querySelector('.result-card:nth-child(2) ul');
    recommendationsList.innerHTML = '';
    data.recomendaciones.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        recommendationsList.appendChild(li);
    });
}
// Update user profile
app.put('/api/perfil/:perfil_id', async (req, res) => {
    const { perfil_id } = req.params;
    const { nombre_completo, correo_electronico, telefono } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE perfiles SET nombre_completo = $1, correo_electronico = $2, telefono = $3 WHERE id = $4 RETURNING *',
        [nombre_completo, correo_electronico, telefono || null, perfil_id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Perfil no encontrado' });
      }
  
      res.json({ mensaje: 'Perfil actualizado', perfil: result.rows[0] });
    } catch (err) {
      console.error('Error al actualizar perfil:', err);
      res.status(500).json({ error: 'Error al actualizar perfil' });
    }
  });
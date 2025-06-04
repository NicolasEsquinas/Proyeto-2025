// auth.js - Manejo de autenticación

document.addEventListener('DOMContentLoaded', function() {
    // Elementos comunes
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const strengthBars = document.querySelectorAll('.strength-bar');
    
    // Funcionalidad para mostrar/ocultar contraseña
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    });
    
    // Validación de fortaleza de contraseña
    if (document.getElementById('registerPassword')) {
        document.getElementById('registerPassword').addEventListener('input', function() {
            const strengthText = document.querySelector('.strength-text span');
            const bars = document.querySelectorAll('.strength-bar');
            const password = this.value;
            let strength = 0;
            
            // Reset
            bars.forEach(bar => bar.style.background = '#e9ecef');
            strengthText.textContent = 'Débil';
            strengthText.style.color = '#dc3545';
            
            // Validaciones
            if (password.length >= 8) strength++;
            if (password.match(/[A-Z]/)) strength++;
            if (password.match(/[0-9]/)) strength++;
            if (password.match(/[^A-Za-z0-9]/)) strength++;
            
            // Actualizar UI
            if (strength > 0) {
                for (let i = 0; i < strength; i++) {
                    let color;
                    
                    if (strength === 1) {
                        color = '#dc3545'; // Rojo
                        strengthText.textContent = 'Débil';
                    } else if (strength === 2) {
                        color = '#fd7e14'; // Naranja
                        strengthText.textContent = 'Moderada';
                    } else if (strength === 3) {
                        color = '#ffc107'; // Amarillo
                        strengthText.textContent = 'Fuerte';
                    } else {
                        color = '#28a745'; // Verde
                        strengthText.textContent = 'Muy Fuerte';
                        strengthText.style.color = '#28a745';
                    }
                    
                    bars[i].style.background = color;
                }
            }
        });
    }
    
    // Manejo del formulario de login
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe').checked;
            
            // Simular autenticación (en un caso real sería una llamada AJAX)
            simulateLogin(email, password, rememberMe);
        });
    }
    
    // Manejo del formulario de registro
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirm').value;
            const acceptTerms = document.getElementById('acceptTerms').checked;
            
            // Validaciones
            if (password !== confirmPassword) {
                alert('Las contraseñas no coinciden');
                return;
            }
            
            if (!acceptTerms) {
                alert('Debes aceptar los términos y condiciones');
                return;
            }
            
            // Simular registro (en un caso real sería una llamada AJAX)
            simulateRegister(name, email, password);
        });
    }
    
    // Manejo del menú de usuario
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
    
    // Cerrar sesión
    if (document.getElementById('logoutBtn')) {
        document.getElementById('logoutBtn').addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });
    }
    
    // Cambiar avatar
    if (document.getElementById('changeAvatar')) {
        document.getElementById('changeAvatar').addEventListener('click', function() {
            alert('Funcionalidad para cambiar avatar estará disponible pronto');
        });
    }
    
    // Actualizar perfil
    if (document.getElementById('profileForm')) {
        document.getElementById('profileForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullName = document.getElementById('profileFullName').value;
            const email = document.getElementById('profileEmailInput').value;
            const phone = document.getElementById('profilePhone').value;
            const birthdate = document.getElementById('profileBirthdate').value;
            
            // Simular actualización
            alert('Perfil actualizado correctamente');
        });
    }
    
    // Cambiar contraseña
    if (document.getElementById('securityForm')) {
        document.getElementById('securityForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const currentPassword = document.getElementById('currentPassword').value;
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validaciones
            if (newPassword !== confirmPassword) {
                alert('Las nuevas contraseñas no coinciden');
                return;
            }
            
            if (newPassword.length < 8) {
                alert('La contraseña debe tener al menos 8 caracteres');
                return;
            }
            
            // Simular cambio
            alert('Contraseña cambiada correctamente');
            document.getElementById('securityForm').reset();
        });
    }
});

// Funciones de simulación (en un caso real serían llamadas a tu backend)
function simulateLogin(email, password, rememberMe) {
    // Mostrar carga
    const submitBtn = document.querySelector('#loginForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
    
    // Simular retraso de red
    setTimeout(() => {
        // Guardar en localStorage (simulando sesión)
        localStorage.setItem('authToken', 'simulated-token');
        localStorage.setItem('userEmail', email);
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        } else {
            sessionStorage.setItem('authToken', 'simulated-token');
        }
        
        // Redirigir a la página principal
        window.location.href = 'index-principal.html';
    }, 1500);
}

function simulateRegister(name, email, password) {
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...';
    
    // Validación adicional
    if (!name || !email || !password) {
        alert('Por favor completa todos los campos');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Crear Cuenta';
        return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un email válido');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Crear Cuenta';
        return;
    }

    setTimeout(() => {
        // Guardar datos simulados
        const userData = {
            name: name,
            email: email,
            password: password // En producción nunca almacenar así
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('authToken', 'simulated-token-' + Math.random().toString(36).substr(2, 9));
        
        // Mostrar feedback
        alert('¡Cuenta creada con éxito! Redirigiendo...');
        
        // Redirigir a completar perfil
        window.location.href = '/index/profile.html';
    }, 1500);
}

function logoutUser() {
    // Eliminar datos de sesión
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('authToken');
    
    // Redirigir a login
    window.location.href = '/auth/login.html';
}


    
    if (!authToken && window.location.pathname.includes('/index/profile.html')) {
        window.location.href = '/auth/login.html';
    }
    
    if (authToken) {
        // Actualizar UI con datos del usuario
        const userData = JSON.parse(localStorage.getItem('userData'));
        
        if (userData && document.getElementById('userName')) {
            document.getElementById('userName').textContent = userData.name;
            document.getElementById('userEmail').textContent = userData.email;
            document.getElementById('profileName').textContent = userData.name;
            document.getElementById('profileEmail').textContent = userData.email;
            document.getElementById('profileFullName').value = userData.name;
            document.getElementById('profileEmailInput').value = userData.email;
        }
    }
}

// Ejecutar al cargar
checkAuth();
// En simulateLogin y simulateRegister, asegúrate de guardar los datos del usuario:
function simulateLogin(email, password, rememberMe) {
    
    // ...
    setTimeout(() => {
        const userData = {
            name: email.split('@')[0], // Ejemplo: extrae el nombre del email
            email: email
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        // ...
    });
    
}

function simulateRegister(name, email, password) {
    // ...
    setTimeout(() => {
        const userData = {
            name: name,
            email: email
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        // ...
    });
}
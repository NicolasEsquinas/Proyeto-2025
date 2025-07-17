// auth.js - Gestión completa de autenticación y perfil

document.addEventListener('DOMContentLoaded', function() {
    // Verificar estado de autenticación al cargar la página
    checkAuthState();
    
    // Manejar formulario de login si existe
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }

    // Manejar formulario de registro si existe
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }

    // Manejar formulario de perfil si existe
    if (document.getElementById('profileForm')) {
        document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    }

    // Manejar botón de logout si existe
    const authActionBtn = document.getElementById('authActionBt');
    if (authActionBtn) {
        authActionBtn.addEventListener('click', handleLogout);
    }
});

// Función para verificar estado de autenticación
function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (user) {
        // Actualizar UI con datos del usuario
        if (userNameElement) userNameElement.textContent = user.name;
        if (userEmailElement) userEmailElement.textContent = user.email;
        
        // Actualizar botón de autenticación
        const authActionBtn = document.getElementById('authActionBt');
        if (authActionBtn) {
            authActionBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar sesión';
            authActionBtn.href = "#";
        }
        
        // Actualizar sección de perfil si existe
        const profileNameElement = document.getElementById('profileName');
        const profileEmailElement = document.getElementById('profileEmail');
        const profileFullNameInput = document.getElementById('profileFullName');
        const profileEmailInput = document.getElementById('profileEmailInput');
        
        if (profileNameElement) profileNameElement.textContent = user.name;
        if (profileEmailElement) profileEmailElement.textContent = user.email;
        if (profileFullNameInput) profileFullNameInput.value = user.name;
        if (profileEmailInput) profileEmailInput.value = user.email;
        if (user.phone && document.getElementById('profilePhone')) {
            document.getElementById('profilePhone').value = user.phone;
        }
    }
}

// Manejar inicio de sesión
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulación de backend
    const mockUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        alert('Sesión iniciada correctamente.');
        
        // Redirigir a perfil
        window.location.href = '/index/profile.html';
    } else {
        alert('Credenciales incorrectas. Por favor intente nuevamente.');
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;
    
    // Validar contraseñas
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    
    // Guardar nuevo usuario
    const newUser = { name, email, password };
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Autologin después de registro
    localStorage.setItem('user', JSON.stringify(newUser));
    alert('Usuario registrado correctamente.');
    
    // Redirigir a perfil
    window.location.href = '/index/profile.html';
}

// Manejar actualización de perfil
function handleProfileUpdate(e) {
    e.preventDefault();
    
    // Obtener datos actualizados
    const updatedUser = {
        name: document.getElementById('profileFullName').value,
        email: document.getElementById('profileEmailInput').value,
        phone: document.getElementById('profilePhone').value
    };
    
    // Obtener usuario actual
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    // Actualizar datos
    const updatedUserData = {
        ...currentUser,
        ...updatedUser
    };
    
    // Guardar cambios
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    
    // Actualizar lista de usuarios (para mantener credenciales)
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            ...updatedUser
        };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Actualizar UI
    checkAuthState();
    alert('¡Perfil actualizado correctamente!');
}

// Manejar cierre de sesión
function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('user');
    
    // Actualizar UI
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (userNameElement) userNameElement.textContent = 'Invitado';
    if (userEmailElement) userEmailElement.textContent = 'No has iniciado sesión';
    
    // Actualizar botón
    const authActionBtn = document.getElementById('authActionBt');
    if (authActionBtn) {
        authActionBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar sesión';
        authActionBtn.href = "/auth/login.html";
    }
    
    // Redirigir a login
    window.location.href = '/auth/login.html';
}
// auth.js - Sistema de autenticación y gestión de perfil

// Función para verificar estado de autenticación
function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('user')) || null;
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    
    if (user) {
        if (userNameElement) userNameElement.textContent = user.name;
        if (userEmailElement) userEmailElement.textContent = user.email;
        
        // Actualizar botón de autenticación
        const authActionBtn = document.getElementById('authActionBt');
        if (authActionBtn) {
            authActionBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar sesión';
            authActionBtn.href = "#";
            authActionBtn.onclick = handleLogout;
        }
        
        // Actualizar sección de perfil si existe
        const profileNameElement = document.getElementById('profileName');
        const profileEmailElement = document.getElementById('profileEmail');
        const profileFullNameInput = document.getElementById('profileFullName');
        const profileEmailInput = document.getElementById('profileEmailInput');
        
        if (profileNameElement) profileNameElement.textContent = user.name;
        if (profileEmailElement) profileEmailElement.textContent = user.email;
        if (profileFullNameInput) profileFullNameInput.value = user.name;
        if (profileEmailInput) profileEmailInput.value = user.email;
        if (user.phone && document.getElementById('profilePhone')) {
            document.getElementById('profilePhone').value = user.phone;
        }
    } else {
        if (userNameElement) userNameElement.textContent = 'Invitado';
        if (userEmailElement) userEmailElement.textContent = 'No has iniciado sesión';
        
        const authActionBtn = document.getElementById('authActionBt');
        if (authActionBtn) {
            authActionBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar sesión';
            authActionBtn.href = "/auth/login.html";
            authActionBtn.onclick = null;
        }
    }
}

// Manejar inicio de sesión
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Simulación de backend
    const mockUsers = JSON.parse(localStorage.getItem('users')) || [];
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify(user));
        
        // Redirigir a página principal
        window.location.href = '/index.html';
    } else {
        alert('Credenciales incorrectas. Por favor intente nuevamente.');
    }
}

// Manejar registro
async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;
    
    // Validar contraseñas
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }
    
    // Guardar nuevo usuario
    const newUser = { name, email, password };
    let users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Verificar si el usuario ya existe
    if (users.some(u => u.email === email)) {
        alert('Este correo electrónico ya está registrado.');
        return;
    }
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Autologin después de registro
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Redirigir a página principal
    window.location.href = '/index.html';
}

// Manejar actualización de perfil
function handleProfileUpdate(e) {
    if (e) e.preventDefault();
    
    // Obtener datos actualizados
    const updatedUser = {
        name: document.getElementById('profileFullName').value,
        email: document.getElementById('profileEmailInput').value,
        phone: document.getElementById('profilePhone').value || ''
    };
    
    // Obtener usuario actual
    const currentUser = JSON.parse(localStorage.getItem('user'));
    
    // Actualizar datos
    const updatedUserData = {
        ...currentUser,
        ...updatedUser
    };
    
    // Guardar cambios
    localStorage.setItem('user', JSON.stringify(updatedUserData));
    
    // Actualizar lista de usuarios (para mantener credenciales)
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        users[userIndex] = {
            ...users[userIndex],
            ...updatedUser
        };
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // Actualizar UI en todas las páginas
    checkAuthState();
    alert('¡Perfil actualizado correctamente!');
}

// Manejar cierre de sesión
function handleLogout(e) {
    if (e) e.preventDefault();
    localStorage.removeItem('user');
    
    // Redirigir a página de inicio
    window.location.href = '/index.html';
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    // Verificar estado de autenticación
    checkAuthState();
    
    // Asignar manejadores de eventos según la página
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
    
    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }
    
    if (document.getElementById('profileForm')) {
        document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
    }
    
    const authActionBtn = document.getElementById('authActionBt');
    if (authActionBtn) {
        authActionBtn.addEventListener('click', function(e) {
            if (localStorage.getItem('user')) {
                handleLogout(e);
            }
        });
    }
});
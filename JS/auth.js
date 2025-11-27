// Restaurar sesión al cargar página

document.addEventListener("DOMContentLoaded", () => {

    const perfil_id = localStorage.getItem("perfil_id");
    const nombre_completo = localStorage.getItem("nombre_completo");
    const correo_electronico = localStorage.getItem("correo_electronico");

    const logged = perfil_id && nombre_completo && correo_electronico;

    // ACEPTA TODOS LOS POSIBLES IDS DE TUS PÁGINAS (importante)
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail") || document.getElementById("userEmailElements");
    const authActionBtn = document.getElementById("authActionBtn") || document.getElementById("authActionBt");

    if (logged) {
        if (userName) userName.textContent = nombre_completo;
        if (userEmail) userEmail.textContent = correo_electronico;

        if (authActionBtn) {
            authActionBtn.textContent = "Cerrar sesión";
            authActionBtn.href = "#";
            authActionBtn.onclick = logout;
        }
    } else {
        if (userName) userName.textContent = "Invitado";
        if (userEmail) userEmail.textContent = "No has iniciado sesión";
    }

    // Cargar datos en el perfil

    const profileName = document.getElementById("profileName");
    const profileFullName = document.getElementById("profileFullName");
    const profileEmailInput = document.getElementById("profileEmailInput");
    const profilePhoneInput = document.getElementById("profilePhone");

    if (logged) {
        if (profileName) profileName.textContent = nombre_completo;
        if (profileFullName) profileFullName.value = nombre_completo;
        if (profileEmailInput) profileEmailInput.value = correo_electronico;

        const telefono = localStorage.getItem("telefono");
        if (profilePhoneInput && telefono) profilePhoneInput.value = telefono;
    }

    // LOGIN CONEXIÓN (función) (api/login)

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const correo_electronico = document.getElementById("loginEmail").value.trim();
            const contrasena = document.getElementById("loginPassword").value.trim();

            if (!correo_electronico || !contrasena) {
                alert("Completá correo y contraseña.");
                return;
            }

            try {
                const response = await fetch(`${API_URL_NODE}/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ correo_electronico, contrasena }),
                });

                const data = await response.json();
                console.log("Respuesta /api/login:", response.status, data);

                if (!response.ok) {
                    alert(data.error || "Credenciales inválidas");
                    console.error("Error en login:", data.error);
                    return;
                }

                // Guardar sesión
                localStorage.setItem("perfil_id", data.perfil_id);
                localStorage.setItem("nombre_completo", data.nombre_completo);
                localStorage.setItem("correo_electronico", data.correo_electronico);
                if (data.telefono) {
                    localStorage.setItem("telefono", data.telefono);
                }

                window.location.href = "/index.html";

            } catch (error) {
                console.error("Error en login:", error);
                alert("Error de conexión al iniciar sesión");
            }
        });
    }

    // REGISTRO CONEXIÓN (función) (api/registro)
    const registerForm = document.getElementById("registerForm");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre_completo = document.getElementById("registerName").value.trim();
            const correo_electronico = document.getElementById("registerEmail").value.trim();
            const contrasena = document.getElementById("registerPassword").value.trim();
            const telefono = document.getElementById("registerPhone")
                ? document.getElementById("registerPhone").value.trim()
                : null;

            if (!nombre_completo || !correo_electronico || !contrasena) {
                alert("Completá nombre, correo y contraseña.");
                return;
            }

            try {
                const response = await fetch(`${API_URL_NODE}/api/registro`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        nombre_completo,
                        correo_electronico,
                        contrasena,
                        telefono
                    }),
                });

                const data = await response.json();
                console.log("Respuesta /api/registro:", response.status, data);

                if (!response.ok) {
                    alert(data.error || "Error al registrarse");
                    return;
                }

                // Guardamos datos mínimos en localStorage
                localStorage.setItem("perfil_id", data.perfil_id);
                localStorage.setItem("nombre_completo", nombre_completo);
                localStorage.setItem("correo_electronico", correo_electronico);
                if (telefono) localStorage.setItem("telefono", telefono);

                alert("Registro exitoso. Sesión iniciada.");
                window.location.href = "/index.html";

            } catch (error) {
                console.error("Error en registro:", error);
                alert("Error de conexión al registrarse");
            }
        });
    }
});



// Cerrar sesión

function logout() {
    localStorage.removeItem("perfil_id");
    localStorage.removeItem("nombre_completo");
    localStorage.removeItem("correo_electronico");
    localStorage.removeItem("telefono");
    window.location.href = "/auth/login.html";
}


// ACTUALIZAR DATOS DEL USUARIO CONEXIÓN (función) (api/perfil/update)

async function actualizarPerfil() {
    const perfil_id = localStorage.getItem("perfil_id");
    if (!perfil_id) {
        alert("Error: no hay sesión activa.");
        return;
    }

    const nombre_completo = document.getElementById("profileFullName").value;
    const correo_electronico = document.getElementById("profileEmailInput").value;
    const telefono = document.getElementById("profilePhone").value;

    try {
        const response = await fetch(`${API_URL_NODE}/api/perfil/update`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                perfil_id,
                nombre_completo,
                correo_electronico,
                telefono
            })
        });

        const data = await response.json();
        console.log("Respuesta /api/perfil/update:", response.status, data);

        if (!response.ok) {
            alert(data.error || "Error al actualizar perfil");
            return;
        }

        // Actualiza el localStorage
        localStorage.setItem("nombre_completo", data.perfil.nombre_completo);
        localStorage.setItem("correo_electronico", data.perfil.correo_electronico);
        if (data.perfil.telefono) {
            localStorage.setItem("telefono", data.perfil.telefono);
        }

        // Actualiza el nombre en el menú si existe
        const menuUserName = document.getElementById("menuUserName");
        if (menuUserName) {
            menuUserName.textContent = data.perfil.nombre_completo;
        }

        alert("Datos actualizados correctamente.");

    } catch (error) {
        console.error("Error actualizando perfil:", error);
        alert("Error en el servidor");
    }
}

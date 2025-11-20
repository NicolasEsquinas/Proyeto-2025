// ==========================
// Restaurar sesión al cargar página
// ==========================
document.addEventListener("DOMContentLoaded", () => {

    const perfil_id = localStorage.getItem("perfil_id");
    const nombre_completo = localStorage.getItem("nombre_completo");
    const correo_electronico = localStorage.getItem("correo_electronico");

    const logged = perfil_id && nombre_completo && correo_electronico;

    // ACEPTA TODOS LOS POSIBLES IDS DE TUS PÁGINAS
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

    // ==========================
    // Cargar datos en el perfil
    // ==========================
    const profileName = document.getElementById("profileName");
    const profileFullName = document.getElementById("profileFullName");
    const profileEmailInput = document.getElementById("profileEmailInput");

    if (logged) {
        if (profileName) profileName.textContent = nombre_completo;
        if (profileFullName) profileFullName.value = nombre_completo;
        if (profileEmailInput) profileEmailInput.value = correo_electronico;
    }
});


// ==========================
// Cerrar sesión
// ==========================
function logout() {
    localStorage.removeItem("perfil_id");
    localStorage.removeItem("nombre_completo");
    localStorage.removeItem("correo_electronico");
    window.location.href = "/auth/login.html";
}


// ==========================
// LOGIN
// ==========================
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const correo_electronico = document.getElementById("loginEmail").value.trim();
            const contrasena = document.getElementById("loginPassword").value.trim();

            try {
                const response = await fetch("https://derma-scan-backend.vercel.app/api/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ correo_electronico, contrasena }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error("Error en login:", data.error);
                    return;
                }

                // Guardar sesión
                localStorage.setItem("perfil_id", data.perfil_id);
                localStorage.setItem("nombre_completo", data.nombre_completo);

                localStorage.setItem("correo_electronico", correo_electronico);

                window.location.href = "/index.html";

            } catch (error) {
                console.error("Error en login:", error);
            }
        });
    }
});


//  ACTUALIZAR DATOS DEL USUARIO

document.addEventListener("DOMContentLoaded", () => {
    const name = localStorage.getItem("nombre_completo") || "Nombre Usuario";
    const email = localStorage.getItem("correo_electronico") || "usuario@ejemplo.com";
    const phone = localStorage.getItem("telefono") || "";

    document.getElementById("profileName").textContent = name;
    document.getElementById("profileFullName").value = name;
    document.getElementById("profileEmailInput").value = email;
    document.getElementById("profilePhone").value = phone;
});

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
        const response = await fetch("https://dermascan-backend.vercel.app/api/perfil/update", {
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

        if (!response.ok) {
            alert(data.error || "Error al actualizar perfil");
            return;
        }

        // 🔥 Actualiza el localStorage
        localStorage.setItem("nombre_completo", data.perfil.nombre_completo);
        localStorage.setItem("correo_electronico", data.perfil.correo_electronico);
        localStorage.setItem("telefono", data.perfil.telefono);

        // 🔥 Actualiza el nombre del menú automáticamente
        document.getElementById("menuUserName").textContent = data.perfil.nombre_completo;

        alert("Datos actualizados correctamente.");

    } catch (error) {
        console.error("Error actualizando perfil:", error);
        alert("Error en el servidor");
    }
}

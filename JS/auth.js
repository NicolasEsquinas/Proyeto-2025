document.addEventListener("DOMContentLoaded", () => {
    // LOGIN
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
                    console.error("Error en login:", data.error || "Error al iniciar sesión");
                    return;
                }

                localStorage.setItem("perfil_id", data.perfil_id);
                localStorage.setItem("nombre_completo", data.nombre_completo);
                localStorage.setItem("correo_electronico", data.correo_electronico);

                window.location.href = "/"; // redirige al home o dashboard
            } catch (error) {
                console.error("Error en login:", error.message);
            }
        });
    }

    // REGISTRO
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre_completo = document.getElementById("registerName").value.trim();
            const correo_electronico = document.getElementById("registerEmail").value.trim();
            const contrasena = document.getElementById("registerPassword").value.trim();

            try {
                const response = await fetch("https://derma-scan-backend.vercel.app/api/registro", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre_completo, correo_electronico, contrasena }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error("Error en registro:", data.error || "Error al registrarse");
                    return;
                }

                localStorage.setItem("perfil_id", data.perfil_id);
                localStorage.setItem("nombre_completo", nombre_completo);
                localStorage.setItem("correo_electronico", correo_electronico);

                window.location.href = "/login.html"; // redirige al login
            } catch (error) {
                console.error("Error en registro:", error.message);
            }
        });
    }
});

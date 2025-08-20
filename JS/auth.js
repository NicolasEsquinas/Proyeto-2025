const API_URL = "https://derma-scan-backend.vercel.app/api"; // tu backend en Vercel

document.addEventListener("DOMContentLoaded", () => {
  // --- REGISTRO ---
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre_completo = document.getElementById("registerName").value.trim();
      const correo_electronico = document.getElementById("registerEmail").value.trim();
      const contrasena = document.getElementById("registerPassword").value.trim();
      const confirm = document.getElementById("registerConfirm").value.trim();

      if (contrasena !== confirm) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/registro`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre_completo, correo_electronico, contrasena })
        });

        const data = await res.json();

        if (res.ok) {
          alert("Registro exitoso ✅");
          localStorage.setItem("perfil_id", data.perfil_id);
          localStorage.setItem("nombre_completo", nombre_completo);
          window.location.href = "../index.html";
        } else {
          alert(data.error || "Error en registro");
        }
      } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor");
      }
    });
  }

  // --- LOGIN ---
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const correo_electronico = document.getElementById("loginEmail").value.trim();
      const contrasena = document.getElementById("loginPassword").value.trim();

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ correo_electronico, contrasena })
        });

        const data = await res.json();

        if (res.ok) {
          alert("Login exitoso ✅");
          localStorage.setItem("perfil_id", data.perfil_id);
          localStorage.setItem("nombre_completo", data.nombre_completo);
          window.location.href = "../index.html";
        } else {
          alert(data.error || "Error en login");
        }
      } catch (err) {
        console.error(err);
        alert("Error de conexión con el servidor");
      }
    });
  }
});

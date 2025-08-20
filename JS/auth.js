// /JS/auth.js
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
  
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const correo_electronico = document.getElementById("loginEmail").value;
      const contrasena = document.getElementById("loginPassword").value;
  
      try {
        const response = await fetch("https://derma-scan-backend.vercel.app/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ correo_electronico, contrasena }),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          alert("❌ " + (data.error || "Error al iniciar sesión"));
          return;
        }
  
        // ✅ Login correcto
        alert("✅ Bienvenido " + data.nombre_completo);
  
        // Guardar el perfil_id en localStorage para usarlo en historial, etc.
        localStorage.setItem("perfil_id", data.perfil_id);
  
        // Redirigir al index.html
        window.location.href = "../index.html";
      } catch (err) {
        console.error("Error en login:", err);
        alert("⚠️ Error de conexión con el servidor");
      }
    });
  });
  
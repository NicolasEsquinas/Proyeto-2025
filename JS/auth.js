document.addEventListener("DOMContentLoaded", () => {
  // Manejo del toggle de contraseña (para login y registro)
  const togglePasswordIcons = document.querySelectorAll(".toggle-password");

  togglePasswordIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId = icon.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (input) {
        const type = input.getAttribute("type") === "password" ? "text" : "password";
        input.setAttribute("type", type);
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      }
    });
  });

  // Manejo del formulario de login
  const loginForm = document.getElementById("loginForm");
  const errorMessageLogin = document.getElementById("errorMessage");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const correo_electronico = document.getElementById("loginEmail").value;
      const contrasena = document.getElementById("loginPassword").value;

      if (errorMessageLogin) errorMessageLogin.textContent = "";

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
          throw new Error(data.error || "Error al iniciar sesión");
        }

        localStorage.setItem("perfil_id", data.perfil_id);
        localStorage.setItem("nombre_completo", data.nombre_completo);

        if (errorMessageLogin) {
          errorMessageLogin.style.color = "green";
          errorMessageLogin.textContent = `✅ Bienvenido ${data.nombre_completo}`;
          setTimeout(() => {
            window.location.href = "../index.html";
          }, 1000);
        } else {
          window.location.href = "../index.html";
        }
      } catch (err) {
        console.error("Error en login:", err);
        if (errorMessageLogin) {
          errorMessageLogin.style.color = "red";
          errorMessageLogin.textContent = `❌ ${err.message}`;
        } else {
          alert(`❌ ${err.message}`);
        }
      }
    });
  }

  // Manejo del formulario de registro
  const registerForm = document.getElementById("registerForm");
  const errorMessageRegister = document.getElementById("errorMessage");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nombre_completo = document.getElementById("registerName").value;
      const correo_electronico = document.getElementById("registerEmail").value;
      const contrasena = document.getElementById("registerPassword").value;
      const confirmar_contrasena = document.getElementById("registerConfirm").value;

      if (errorMessageRegister) errorMessageRegister.textContent = "";

      // Validar que las contraseñas coincidan
      if (contrasena !== confirmar_contrasena) {
        if (errorMessageRegister) {
          errorMessageRegister.style.color = "red";
          errorMessageRegister.textContent = "❌ Las contraseñas no coinciden";
        } else {
          alert("❌ Las contraseñas no coinciden");
        }
        return;
      }

      try {
        const response = await fetch("https://derma-scan-backend.vercel.app/api/registro", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre_completo, correo_electronico, contrasena }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al registrarse");
        }

        if (errorMessageRegister) {
          errorMessageRegister.style.color = "green";
          errorMessageRegister.textContent = `✅ Registro exitoso, bienvenido ${nombre_completo}`;
          setTimeout(() => {
            window.location.href = "./login.html"; // Redirige a login tras registro
          }, 1000);
        } else {
          window.location.href = "./login.html";
        }
      } catch (err) {
        console.error("Error en registro:", err);
        if (errorMessageRegister) {
          errorMessageRegister.style.color = "red";
          errorMessageRegister.textContent = `❌ ${err.message}`;
        } else {
          alert(`❌ ${err.message}`);
        }
      }
    });
  }
});
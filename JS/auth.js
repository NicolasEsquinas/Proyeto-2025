document.addEventListener("DOMContentLoaded", () => {
  // Function to update UI based on login state
  const updateUI = () => {
    const userNameElements = document.querySelectorAll("#userName");
    const userEmailElements = document.querySelectorAll("#userEmail");
    const authActionBt = document.getElementById("authActionBt");
    const profileName = document.getElementById("profileName");
    const profileFullName = document.getElementById("profileFullName");
    const profileEmailInput = document.getElementById("profileEmailInput");
    const profilePhone = document.getElementById("profilePhone");

    const nombre_completo = localStorage.getItem("nombre_completo");
    const correo_electronico = localStorage.getItem("correo_electronico");
    const telefono = localStorage.getItem("telefono");

    if (nombre_completo && correo_electronico) {
      // Update index.html and profile.html header
      userNameElements.forEach((el) => (el.textContent = nombre_completo));
      userEmailElements.forEach((el) => (el.textContent = correo_electronico));
      if (authActionBt) {
        authActionBt.innerHTML = '<i class="fas fa-sign-out-alt"></i> Cerrar sesión';
        authActionBt.href = "#"; // Prevent navigation
        authActionBt.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("perfil_id");
          localStorage.removeItem("nombre_completo");
          localStorage.removeItem("correo_electronico");
          localStorage.removeItem("telefono");
          userNameElements.forEach((el) => (el.textContent = "Invitado"));
          userEmailElements.forEach((el) => (el.textContent = "No has iniciado sesión"));
          authActionBt.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar sesión';
          authActionBt.href = "/auth/login.html";
          window.location.href = "/index.html"; // Redirect to home after logout
        });
      }
      // Update profile.html form
      if (profileName) profileName.textContent = nombre_completo;
      if (profileFullName) profileFullName.value = nombre_completo;
      if (profileEmailInput) profileEmailInput.value = correo_electronico;
      if (profilePhone) profilePhone.value = telefono || "";
    } else {
      // Reset UI if not logged in
      userNameElements.forEach((el) => (el.textContent = "Invitado"));
      userEmailElements.forEach((el) => (el.textContent = "No has iniciado sesión"));
      if (authActionBt) {
        authActionBt.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar sesión';
        authActionBt.href = "/auth/login.html";
      }
    }
  };

  // Call updateUI on page load
  updateUI();
  // Inside DOMContentLoaded, after updateUI()
const perfil_id = localStorage.getItem("perfil_id");
if (perfil_id) {
  fetch(`https://derma-scan-backend.vercel.app/api/perfil/${perfil_id}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.nombre_completo && data.correo_electronico) {
        localStorage.setItem("nombre_completo", data.nombre_completo);
        localStorage.setItem("correo_electronico", data.correo_electronico);
        if (data.telefono) localStorage.setItem("telefono", data.telefono);
        updateUI();
      }
    })
    .catch((err) => console.error("Error al obtener perfil:", err));
}

  // Handle password toggle
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

  // Handle login form
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
        localStorage.setItem("correo_electronico", correo_electronico);

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

  // Handle registration form
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

        localStorage.setItem("perfil_id", data.perfil_id);
        localStorage.setItem("nombre_completo", nombre_completo);
        localStorage.setItem("correo_electronico", correo_electronico);

        if (errorMessageRegister) {
          errorMessageRegister.style.color = "green";
          errorMessageRegister.textContent = `✅ Registro exitoso, bienvenido ${nombre_completo}`;
          setTimeout(() => {
            window.location.href = "./login.html";
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

  // Handle profile form
  const profileForm = document.getElementById("profileForm");
  const errorMessageProfile = document.getElementById("errorMessageProfile"); // Add this to profile.html if needed

  if (profileForm) {
    profileForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nombre_completo = document.getElementById("profileFullName").value;
      const correo_electronico = document.getElementById("profileEmailInput").value;
      const telefono = document.getElementById("profilePhone").value;

      if (errorMessageProfile) errorMessageProfile.textContent = "";

      try {
        const response = await fetch(`https://derma-scan-backend.vercel.app/api/perfil/${localStorage.getItem("perfil_id")}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nombre_completo, correo_electronico, telefono }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al guardar cambios");
        }

        localStorage.setItem("nombre_completo", nombre_completo);
        localStorage.setItem("correo_electronico", correo_electronico);
        if (telefono) localStorage.setItem("telefono", telefono);

        if (errorMessageProfile) {
          errorMessageProfile.style.color = "green";
          errorMessageProfile.textContent = "✅ Cambios guardados";
        } else {
          alert("✅ Cambios guardados");
        }
        updateUI();
      } catch (err) {
        console.error("Error al actualizar perfil:", err);
        if (errorMessageProfile) {
          errorMessageProfile.style.color = "red";
          errorMessageProfile.textContent = `❌ ${err.message}`;
        } else {
          alert(`❌ ${err.message}`);
        }
      }
    });
  }
});
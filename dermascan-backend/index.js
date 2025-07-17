const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Simula un "registro"
app.post('/api/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden' });
  }

  return res.status(200).json({ message: 'Usuario registrado exitosamente' });
});

// Simula un "login"
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (email === 'demo@dermascan.com' && password === '12345678') {
    return res.status(200).json({ message: 'Inicio de sesión exitoso', token: 'fake-jwt-token' });
  } else {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }
});

app.listen(PORT, () => {
  console.log(`🟢 Servidor fake corriendo en http://localhost:${PORT}`);
});

// Importa las dependencias necesarias
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Inicializar la aplicación de Express
const app = express();

// Configuración de CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://3.221.112.57', // Origen permitido
}));

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas
const commentRoutes = require('./routes/comment'); // Importar las rutas de comentarios
const authMiddleware = require('./middleware/authMiddleware'); // Middleware de autenticación

// Ruta pública para probar el servidor
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Ruta protegida con el middleware de autenticación JWT
app.get('/api/protected', authMiddleware, (req, res) => {
  res.json({
    message: 'You have access to the protected route!',
    user: req.user,
    timestamp: new Date().toISOString(),
  });
});

// Usar las rutas de comentarios
app.use('/api/comments', commentRoutes);

// Iniciar el servidor en el puerto definido
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Middleware para autenticar
const multer = require('multer');
const path = require('path');
const { login, register, getAuthenticatedUser, updateAvatar } = require('../controllers/authController');

// Configuración de multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/avatars/');
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// Rutas
router.post('/login', login); // Ruta para iniciar sesión
router.post('/register', register); // Ruta para registrar un usuario
router.get('/me', authMiddleware, getAuthenticatedUser); // Ruta para obtener datos del usuario autenticado
router.post('/me/avatar', authMiddleware, upload.single('avatar'), updateAvatar); // Subir avatar

module.exports = router;

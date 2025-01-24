const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Función de login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Verificar si el correo tiene un formato válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({
            token,
            user: { id: user.id, username: user.username, email: user.email },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            error: 'An error occurred during login',
            details: error.message,
        });
    }
};

// Función de registro
const register = async (req, res) => {
  const { username, email, password, avatar } = req.body;

  try {
    console.log("Datos recibidos:", req.body);

    // Validación básica de los campos
    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'Faltan campos obligatorios.',
        details: 'Proporciona nombre, correo y contraseña.',
      });
    }

    // Validación del formato del correo electrónico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Correo electrónico inválido.',
        details: 'Introduce un correo válido.',
      });
    }

    // Validación de la contraseña
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error: 'Contraseña inválida',
        details: 'Debe tener al menos 8 caracteres, una letra y un número.',
      });
    }

    // Verificar si el correo ya está registrado
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({
        error: 'Correo en uso',
        details: 'Este correo ya está registrado.',
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar: avatar || null, // Avatar opcional
    });

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: { id: user.id, username: user.username, email: user.email, avatar: user.avatar },
    });
  } catch (error) {
    console.error('Error durante el registro:', error);
    res.status(500).json({
      error: 'Error del servidor.',
      details: error.message,
    });
  }
};


// Obtener datos del usuario autenticado
const getAuthenticatedUser = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: ['id', 'username', 'email', 'avatar'],
      });
  
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      res.json(user);
    } catch (error) {
      console.error('Error al obtener usuario autenticado:', error);
      res.status(500).json({ error: 'Error al obtener usuario' });
    }
  };
  
  // Actualizar avatar del usuario
  const updateAvatar = async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No se subió ningún archivo' });
      }
  
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      user.avatar = `/uploads/avatars/${req.file.filename}`;
      await user.save();
  
      res.json({ avatar: user.avatar });
    } catch (error) {
      console.error('Error al actualizar el avatar:', error);
      res.status(500).json({ error: 'Error al actualizar el avatar' });
    }
  };
  
  module.exports = {
    login,
    register,
    getAuthenticatedUser,
    updateAvatar,
  };
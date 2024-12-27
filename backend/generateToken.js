const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

const generateToken = (user) => {
  return jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' } // Cambia este valor si necesitas un tiempo mayor
  );
};


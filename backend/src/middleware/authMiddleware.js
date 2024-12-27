const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
      const authHeader = req.headers.authorization;
      console.log('Encabezado Authorization:', authHeader); // Depuración

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
          console.log('Encabezado de autorización faltante o incorrecto:', authHeader);
          return res.status(401).json({ error: 'Access denied. Invalid token format.' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log('Token decodificado en middleware:', decoded);

      if (!decoded.id) {
          return res.status(401).json({ error: 'Invalid token: missing user ID.' });
      }

      req.user = decoded; // Configurar el usuario
      next();
  } catch (error) {
      console.error('Error al verificar el token:', error.message);
      const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;
      res.status(statusCode).json({ error: 'Invalid or expired token.' });
  }
};


module.exports = authMiddleware;

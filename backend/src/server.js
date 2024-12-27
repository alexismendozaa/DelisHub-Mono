const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const commentRoutes = require('./routes/comment');
const { syncDatabase } = require('./models');
const errorHandler = require('./middleware/errorHandler');

// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Configuración de CORS
app.use(cors({
  origin: [/http:\/\/localhost:\d+/], // Aceptar localhost con cualquier puerto
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

// Middleware para manejar JSON
app.use(express.json());

// Crear el servidor HTTP
const server = http.createServer(app);

// Configuración de Socket.io
const io = new Server(server);
const activeUsers = {};

// Conexión a la base de datos
sequelize.authenticate()
  .then(() => {
    console.log('Database connected');
    return sequelize.sync({ alter: true }); // Sincronizar la base de datos con los modelos
  })
  .then(() => console.log('Database synchronized successfully'))
  .catch(err => console.error('Database connection error:', err));

// Rutas principales
app.get('/', (req, res) => res.send('DelisHub API')); // Actualizado para reflejar tu aplicación

// Registrar rutas
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);

// Middleware de manejo de errores
app.use(errorHandler);

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'DelisHub API',
      version: '1.0.0',
      description: 'API for managing recipes and comments',
    },
  },
  apis: ['./src/routes/*.js'], // Rutas para buscar documentación
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('register', (userId) => {
    console.log(`User registered: ${userId}`);
    activeUsers[userId] = socket.id;
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);

    const userId = Object.keys(activeUsers).find(
      (key) => activeUsers[key] === socket.id
    );
    if (userId) {
      delete activeUsers[userId];
      console.log(`User ${userId} disconnected`);
    }
  });
});

// Exportar app e io
module.exports = { app, io };

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

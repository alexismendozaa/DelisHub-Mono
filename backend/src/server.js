const express = require('express');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const commentRoutes = require('./routes/comment');
const { syncDatabase } = require('./models');
const errorHandler = require('./middleware/errorHandler');
const userProfileRoutes = require('./routes/userProfileRoutes');
const userConfigRoutes = require('./routes/userConfigRoutes');

// Swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Configuración de CORS
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173', // Variable de entorno o localhost para desarrollo
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
    return sequelize.sync(); // Sincronizar modelos con la base de datos
  })
  .then(() => {
    console.log('Database synchronized successfully');
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });

// Rutas del backend
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/user-profile', userProfileRoutes);
app.use('/api/user-config', userConfigRoutes);

// Swagger Docs
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API for DelisHub',
    },
    servers: [
      { url: process.env.CLIENT_ORIGIN || 'http://localhost:5173' },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware para manejar errores
app.use(errorHandler);

// Configurar el frontend después de las rutas del backend
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

// Inicializar Socket.io
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('user-active', (userId) => {
    activeUsers[userId] = socket.id;
    console.log('Active Users:', activeUsers);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    for (const userId in activeUsers) {
      if (activeUsers[userId] === socket.id) {
        delete activeUsers[userId];
        break;
      }
    }
    console.log('Active Users after disconnect:', activeUsers);
  });
});

// Servidor escuchando en el puerto configurado
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

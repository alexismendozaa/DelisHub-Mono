const sequelize = require('../config/database');
const User = require('./User');
const Recipe = require('./Recipe');
const Comment = require('./Comment');

// Sincronización de modelos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false }); // Cambiar a `true` si necesitas recrear las tablas
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

// Relacionar los modelos
User.associate({ Recipe });
Recipe.associate({ User });

module.exports = { sequelize, User, Recipe, Comment, syncDatabase };

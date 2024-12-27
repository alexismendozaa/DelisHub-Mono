const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Recipe = require('./Recipe');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Relaciones
Comment.belongsTo(User, { foreignKey: 'userId' });
Comment.belongsTo(Recipe, { foreignKey: 'recipeId' });
User.hasMany(Comment, { foreignKey: 'userId' });
Recipe.hasMany(Comment, { foreignKey: 'recipeId' });

module.exports = Comment;

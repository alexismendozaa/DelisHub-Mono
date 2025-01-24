const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define el modelo User
const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true, // Permitido ser null inicialmente
    },
});

// Relación con el modelo Recipe
User.associate = (models) => {
    User.hasMany(models.Recipe, { foreignKey: 'userId', as: 'recipes' });
};

module.exports = User;

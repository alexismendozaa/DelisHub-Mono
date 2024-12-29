const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User'); // Importar para definir la relación

const Recipe = sequelize.define('Recipe', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    ingredients: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    steps: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
}, {
    timestamps: true,
});

// Relación: Una receta pertenece a un usuario
Recipe.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = Recipe;

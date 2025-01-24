const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define el modelo Recipe
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
    timestamps: true, // Agrega los campos de timestamp (createdAt, updatedAt)
});

// Relación: Una receta pertenece a un usuario
Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
};

module.exports = Recipe;

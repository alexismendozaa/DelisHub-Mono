const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recipe = sequelize.define('Recipe', {
    id: {
        type: DataTypes.UUID, // Define el tipo como UUID
        defaultValue: DataTypes.UUIDV4, // Genera automáticamente un UUID
        primaryKey: true, // Configura como clave primaria
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
        type: DataTypes.JSON, // Mantén JSON si coincide con la base de datos
        allowNull: false,
    },
    steps: {
        type: DataTypes.JSON, // Mantén JSON si coincide con la base de datos
        allowNull: false,
    },
}, {
    timestamps: true, // Para incluir createdAt y updatedAt automáticamente
});

module.exports = Recipe;

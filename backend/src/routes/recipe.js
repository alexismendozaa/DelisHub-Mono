const express = require('express');
const router = express.Router();
const { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe } = require('../controllers/recipeController');

// Crear una nueva receta
router.post('/', createRecipe);

// Obtener todas las recetas
router.get('/', getRecipes);

// Obtener una receta por ID
router.get('/:id', getRecipeById);

// Actualizar una receta por ID
router.put('/:id', updateRecipe);

// Eliminar una receta por ID
router.delete('/:id', deleteRecipe);

module.exports = router;

const express = require('express');
const router = express.Router();
const {createRecipe,getRecipes,getRecipeById,updateRecipe,deleteRecipe,canModifyRecipe, getRecipesByUser} = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware'); // Asegúrate de tener este middleware

// Crear una nueva receta
router.post('/', authMiddleware, createRecipe);

// Obtener todas las recetas
router.get('/', getRecipes);

// Obtener una receta por ID
router.get('/:id', getRecipeById);

// Actualizar una receta
router.put('/:id', authMiddleware, updateRecipe);

// Eliminar una receta
router.delete('/:id', authMiddleware, deleteRecipe);

router.get('/:id/can-modify', authMiddleware, canModifyRecipe);

// Obtener recetas creadas por un usuario específico
router.get('/user/:userId', authMiddleware, getRecipesByUser);


module.exports = router;

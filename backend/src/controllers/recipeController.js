const Recipe = require('../models/Recipe');

// Crear una nueva receta
const createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, steps } = req.body;

        // Validar campos requeridos
        if (!title || !ingredients || !steps) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validar formato de JSON
        if (!Array.isArray(ingredients) || !Array.isArray(steps)) {
            return res.status(400).json({ error: 'Ingredients and steps must be arrays' });
        }

        // Crear la receta
        const newRecipe = await Recipe.create({ title, description, ingredients, steps });
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Error creating recipe:', error);
        res.status(500).json({ error: 'Error creating recipe', details: error.message });
    }
};



// Obtener todas las recetas
const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recipes', details: error.message });
    }
};

// Obtener una receta por ID
const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching recipe', details: error.message });
    }
};

// Actualizar una receta por ID
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, ingredients, steps } = req.body;
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        await recipe.update({ title, description, ingredients, steps });
        res.status(200).json(recipe);
    } catch (error) {
        res.status(500).json({ error: 'Error updating recipe', details: error.message });
    }
};

// Eliminar una receta por ID
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        await recipe.destroy();
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting recipe', details: error.message });
    }
};

module.exports = { createRecipe, getRecipes, getRecipeById, updateRecipe, deleteRecipe };

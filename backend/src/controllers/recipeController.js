const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Crear una nueva receta
const createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, steps } = req.body;

        if (!title || !ingredients || !steps) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const recipe = await Recipe.create({
            title,
            description,
            ingredients,
            steps,
            userId: req.user.id,
        });

        res.status(201).json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the recipe' });
    }
};

// Obtener todas las recetas
const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.findAll();
        res.json(recipes);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching recipes' });
    }
};

// Obtener una receta por ID
const getRecipeById = async (req, res) => {
    try {
        const { id } = req.params;
        const recipe = await Recipe.findByPk(id, {
            include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }],
        });

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe by ID:', error);
        res.status(500).json({ error: 'An error occurred while fetching the recipe' });
    }
};

// Actualizar una receta
const updateRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, ingredients, steps } = req.body;
        const userId = req.user.id;

        const recipe = await Recipe.findByPk(id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (recipe.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to edit this recipe' });
        }

        await recipe.update({ title, description, ingredients, steps });
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the recipe' });
    }
};

// Eliminar una receta
const deleteRecipe = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const recipe = await Recipe.findByPk(id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        if (recipe.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to delete this recipe' });
        }

        await recipe.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the recipe' });
    }
};

const canModifyRecipe = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener la receta por ID
        const recipe = await Recipe.findByPk(id);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Verificar si el usuario autenticado es el creador de la receta
        const isCreator = recipe.userId === req.user.id;

        res.json({ canModify: isCreator });
    } catch (error) {
        console.error('Error verifying permissions:', error);
        res.status(500).json({ error: 'An error occurred while verifying permissions' });
    }
};


module.exports = {
    createRecipe,
    getRecipes,
    getRecipeById,
    updateRecipe,
    deleteRecipe,
    canModifyRecipe,
};

const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Crear una nueva receta
const createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, steps } = req.body;

        // Validación de campos requeridos
        if (!title || !ingredients || !steps) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Crear la receta
        const recipe = await Recipe.create({
            title,
            description,
            ingredients,
            steps,
            userId: req.user.id, // Asocia la receta con el usuario autenticado
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
            include: [{ model: User, as: 'user', attributes: ['id', 'username', 'email'] }], // Incluye datos del creador
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


// Obtener recetas por usuario
const getRecipesByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const recipes = await Recipe.findAll({
            where: { userId },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email'], // Traer los datos del usuario creador
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'username'], // Traer los datos del autor de los comentarios
                        },
                    ],
                },
            ],
        });

        res.json(recipes);
    } catch (error) {
        console.error('Error al obtener recetas del usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor', error });
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

        // Actualizar la receta
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

        // Eliminar la receta
        await recipe.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while deleting the recipe' });
    }
};

// Verificar si un usuario puede modificar una receta
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

// Exportar las funciones de los controladores
module.exports = {
    createRecipe,
    getRecipes,
    getRecipeById,
    getRecipesByUser,
    updateRecipe,
    deleteRecipe,
    canModifyRecipe,
};

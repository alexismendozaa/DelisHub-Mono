const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Crear un nuevo comentario
const createComment = async (req, res) => {
    try {
        const { recipeId, content } = req.body;
        const userId = req.user.id;

        // Validación de campos requeridos
        if (!recipeId || !content) {
            return res.status(400).json({ error: 'Missing required fields: recipeId or content' });
        }

        // Verificar si la receta existe
        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Crear el comentario
        const newComment = await Comment.create({ recipeId, userId, content });
        res.status(201).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Obtener todos los comentarios de una receta
const getCommentsByRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;

        // Obtener todos los comentarios para la receta indicada
        const comments = await Comment.findAll({
            where: { recipeId },
            include: [
                { model: User, attributes: ['id', 'username', 'email'] } // Incluir información del usuario
            ],
            order: [['createdAt', 'DESC']], // Ordenar por fecha de creación
        });

        res.status(200).json({ count: comments.length, comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Actualizar un comentario
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id;

        // Validación de contenido
        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        // Buscar el comentario
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Verificar si el usuario autenticado es el autor del comentario
        if (comment.userId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to edit this comment' });
        }

        // Actualizar el contenido del comentario
        comment.content = content;
        await comment.save();

        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Eliminar un comentario
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Buscar el comentario
        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Verificar si el usuario autenticado es el autor del comentario
        if (comment.userId !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this comment' });
        }

        // Eliminar el comentario
        await comment.destroy();

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

// Verificar si el usuario puede modificar un comentario
const canModifyComment = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener el comentario por ID
        const comment = await Comment.findByPk(id);

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Verificar si el usuario autenticado es el creador del comentario
        const isCreator = comment.userId === req.user.id;

        res.json({ canModify: isCreator });
    } catch (error) {
        console.error('Error verifying permissions for comment:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
};

module.exports = {
    createComment,
    getCommentsByRecipe,
    updateComment,
    deleteComment,
    canModifyComment,
};

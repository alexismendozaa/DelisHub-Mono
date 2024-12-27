const Comment = require('../models/Comment');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Crear un nuevo comentario
const createComment = async (req, res) => {
    try {
        console.log('Datos recibidos en createComment:', req.body);
        console.log('Usuario autenticado:', req.user);

        const { recipeId, content } = req.body;
        const userId = req.user.id;

        if (!recipeId || !content) {
            return res.status(400).json({ error: 'Missing required fields: recipeId or content' });
        }

        const recipe = await Recipe.findByPk(recipeId);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const newComment = await Comment.create({ recipeId, userId, content });
        res.status(201).json({ message: 'Comment created successfully', comment: newComment });
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Error creating comment', details: error.message });
    }
};


// Obtener todos los comentarios de una receta
const getCommentsByRecipe = async (req, res) => {
    try {
        const { recipeId } = req.params;

        const comments = await Comment.findAll({
            where: { recipeId },
            include: [
                { model: User, attributes: ['id', 'username'] } // Agrega información del usuario
            ],
            order: [['createdAt', 'DESC']], // Ordenar por fecha de creación
        });

        res.status(200).json({ count: comments.length, comments });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Error fetching comments', details: error.message });
    }
};

// Actualizar un comentario
const updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { content } = req.body;
        const userId = req.user.id; // ID del usuario autenticado

        if (!content) {
            return res.status(400).json({ error: 'Content is required to update a comment.' });
        }

        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to edit this comment.' });
        }

        comment.content = content;
        await comment.save();
        res.status(200).json({ message: 'Comment updated successfully', comment });
    } catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Error updating comment', details: error.message });
    }
};

// Eliminar un comentario por ID
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // ID del usuario autenticado

        const comment = await Comment.findByPk(id);
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        if (comment.userId !== userId) {
            return res.status(403).json({ error: 'You do not have permission to delete this comment.' });
        }

        await comment.destroy();
        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting comment:', error);
        res.status(500).json({ error: 'Error deleting comment', details: error.message });
    }
};

module.exports = { createComment, getCommentsByRecipe, updateComment, deleteComment };

const express = require('express');
const router = express.Router();
const {
    createComment,
    getCommentsByRecipe,
    updateComment,
    deleteComment,
    canModifyComment
} = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Crear un nuevo comentario
router.post('/', authMiddleware, createComment);

// Obtener todos los comentarios de una receta
router.get('/:recipeId', getCommentsByRecipe);

// Actualizar un comentario por ID
router.put('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validación adicional de ID y contenido
        if (!id) {
            return res.status(400).json({ error: 'Comment ID is required' });
        }
        if (!req.body.content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        return updateComment(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Eliminar un comentario por ID
router.delete('/:id', authMiddleware, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Validación adicional de ID
        if (!id) {
            return res.status(400).json({ error: 'Comment ID is required' });
        }

        return deleteComment(req, res, next);
    } catch (error) {
        next(error);
    }
});

// Verificar si el usuario puede modificar un comentario
router.get('/:id/can-modify', authMiddleware, canModifyComment);

module.exports = router;

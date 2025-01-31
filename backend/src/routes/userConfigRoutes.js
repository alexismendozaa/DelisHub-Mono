const express = require('express');
const { 
    updateProfile, 
    updatePassword, 
    updateUserEmail, 
    updateUserPassword, 
    deleteUserAccount 
} = require('../controllers/userProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Corregir las rutas eliminando 'user-profile' extra y asegurando que todas las funciones están disponibles
router.put('/update-profile', authMiddleware, updateProfile);
router.put('/update-password', authMiddleware, updateUserPassword);  // ✅ Corregido
router.put('/update-email', authMiddleware, updateUserEmail);        // ✅ Agregado
router.delete('/delete-account/:userId', authMiddleware, deleteUserAccount);  // ✅ Agregado

module.exports = router;

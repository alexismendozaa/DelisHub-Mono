const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserEmail, updateUserPassword, deleteUserAccount } = require('../controllers/userProfileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId', getUserProfile);
router.put('/update-email', authMiddleware, updateUserEmail);
router.put('/update-password', authMiddleware, updateUserPassword);
router.delete('/delete-account/:userId', authMiddleware, deleteUserAccount);

module.exports = router;

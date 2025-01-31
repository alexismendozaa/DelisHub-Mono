const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserEmail, updateUserPassword, deleteUserAccount } = require('../controllers/userProfileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/user-profile/:userId', getUserProfile);
router.put('/user-profile/update-email', authMiddleware, updateUserEmail);
router.put('/user-profile/update-password', authMiddleware, updateUserPassword);
router.delete('/user-profile/delete-account/:userId', authMiddleware, deleteUserAccount);

module.exports = router;

const express = require('express');
const { updateProfile, updatePassword, deleteUserAccount, } = require('../controllers/userProfileController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.put('/user-profile/update-profile', authMiddleware, updateProfile);
router.put('/user-profile/update-password', authMiddleware, updatePassword);
router.delete('/user-profile/delete', authMiddleware, deleteUserAccount);

module.exports = router;

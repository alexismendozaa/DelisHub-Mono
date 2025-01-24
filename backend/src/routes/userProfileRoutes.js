const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userProfileController');

router.get('/user-profile/:userId', getUserProfile);

module.exports = router;

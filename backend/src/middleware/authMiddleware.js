const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }

        req.user = user; // Asignar el usuario al objeto `req`
        next();
    } catch (error) {
        console.error('Error in authMiddleware:', error);
        return res.status(401).json({ error: 'Unauthorized' });
    }
};


module.exports = authMiddleware;

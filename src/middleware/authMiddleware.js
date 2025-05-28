const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.replace('Bearer ', '');

    if (!token) return null;

    try {
        const user = jwt.verify(token, JWT_SECRET);
        return user;
    } catch (err) {
        return null;
    }
};

module.exports = authMiddleware;

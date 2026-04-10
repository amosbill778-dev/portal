// Backend/utils/generateToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
    // 1. Check if secret exists to prevent server crashes
    const secret = process.env.JWT_SECRET || 'your_secret_key';

    // 2. Create the payload
    // Crucial: We MUST include the role so the roleMiddleware works!
    const payload = { 
        userId: user._id, 
        email: user.email,
        role: user.role 
    };

    // 3. Sign the token
    return jwt.sign(
        payload,
        secret,
        { expiresIn: '1h' }
    );
};

module.exports = generateToken;

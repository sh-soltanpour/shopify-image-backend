const jwt = require('jsonwebtoken');

function generateAccessToken(email) {
    return jwt.sign({email}, process.env.TOKEN_SECRET || "123", {expiresIn: '18000s'});
}

module.exports = {generateAccessToken};

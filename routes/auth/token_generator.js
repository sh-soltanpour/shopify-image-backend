const jwt = require('jsonwebtoken');

function generateAccessToken(email) {
    return jwt.sign({email}, process.env.TOKEN_SECRET, {expiresIn: '18000s'});
}

module.exports = {generateAccessToken};

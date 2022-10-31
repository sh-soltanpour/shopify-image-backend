const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
        req.tokenData = {email: decodedToken.email}
        next();
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
        });
    }
};
const {generateAccessToken} = require("./token_generator"),
    bcrypt = require('bcrypt'),
    mongoose = require('mongoose'),
    express = require('express');

const User = mongoose.model("User");
const router = express.Router();

router.post("/", function (req, res) {
    User.findOne({email: req.body.email}, (err, user) => {
        if (user && bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(200).send({
                access_token: generateAccessToken(user)
            });
        } else {
            return res.status(401).send({message: "fail"});
        }
    });
});

module.exports = router;
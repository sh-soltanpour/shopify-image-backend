const {generateAccessToken} = require("./token_generator"),
    bcrypt = require('bcrypt'),
    mongoose = require('mongoose'),
    express = require('express');

const User = mongoose.model("User");
const router = express.Router();

router.post("/", async function (req, res) {
    try {
        const user = await User.findOne({email: req.body.email});
        if (bcrypt.compareSync(req.body.password, user.password)) {
            return res.status(200).send({
                accessToken: generateAccessToken(user.email)
            });
        } else {
            throw new Error();
        }
    } catch (e) {
        return res.status(401).send({message: "Email or password is not correct"});
    }
});

module.exports = router;
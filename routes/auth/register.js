const express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    User = mongoose.model("User"),
    {createAccessToken} = require("./token_generator");

/* GET users listing. */
router.post("/", function (req, res) {
    if (
        !req.body.email ||
        !req.body.password
        // req.body.email.length < 6 ||
        // req.body.password.length < 6
    ) {
        return res.status(400).send("invalid username or password");
    }

    User.findOne({email: req.body.email}, (err, user) => {
        if (user) {
            return res.status(400).send({message: "exists"});
        } else {
            new User({
                email: req.body.email,
                password: req.body.password,
            }).save((err, user) => {
                if (user) {
                    return res.status(201).send({
                        message: "ok",
                        access_token: createAccessToken(user),
                    });
                } else console.error(err);
            });
        }
    });
});

module.exports = router;

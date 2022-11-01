const express = require('express'),
    mongoose = require('mongoose'),
    router = express.Router(),
    User = mongoose.model("User"),
    {generateAccessToken} = require("./token_generator");

router.post("/", async function (req, res) {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send("invalid username or password");
    }

    if (await User.exists({email: req.body.email}))
        return res.status(400).send({message: "Email already exists"});

    const user = await new User({
        email: req.body.email,
        password: req.body.password,
    }).save();

    return res.status(201).send({
        accessToken: generateAccessToken(user),
    });
});

module.exports = router;

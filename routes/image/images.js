const express = require("express"),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    Image = mongoose.model("Image"),
    tokenVerifier = require("../middleware/token_verification");

router.post("/", tokenVerifier, async function (req, res) {
    try {
        const user = await User.findOne({"email": req.tokenData.email})
        const image = await new Image(
            {
                title: req.body.title,
                description: req.body.description,
                owner: user._id,
                link: req.body.link,
            }
        ).save()
        return res.jsonp({
            image
        });
    } catch (e) {
        return res.status(400).jsonp({"message": e.message})
    }

});

module.exports = router;
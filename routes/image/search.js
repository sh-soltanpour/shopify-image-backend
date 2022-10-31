const express = require("express"),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    Image = mongoose.model("Image"),
    tokenVerifier = require("../middleware/token_verification");

router.get("/:query/", tokenVerifier, async function (req, res) {
    try {
        const user = await User.findOne({"email": req.tokenData.email})
        const images = await Image.find(
            {
                $text: {$search: req.params.query},
                $or: [{"private": false}, {"owner": user._id}]
            }
        );
        return res.jsonp({images})
    } catch
        (e) {
        return res.status(400).jsonp({"message": e.message})
    }
});

module.exports = router;
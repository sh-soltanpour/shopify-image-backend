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
                private: req.body.private
            }
        ).save()
        return res.jsonp({
            image
        });
    } catch (e) {
        return res.status(400).jsonp({"message": e.message})
    }

});

router.delete("/all/", tokenVerifier, async function (req, res) {
    try {
        const user = await User.findOne({"email": req.tokenData.email})
        const result = await Image.find({"owner": user._id}).remove();
        return res.status(200).jsonp(result);
    } catch (e) {
        return res.status(404).jsonp({"message": e.message})
    }
});


router.delete("/:id/", tokenVerifier, async function (req, res) {
    try {
        const user = await User.findOne({"email": req.tokenData.email})
        const image = await Image.findOneAndRemove({
            "_id": req.params.id,
            "owner": user._id
        });
        return res.status(200).jsonp(image);
    } catch (e) {
        return res.status(404).jsonp({"message": e.message})
    }
});

router.get("/:id/", tokenVerifier, async function (req, res) {
    try {
        const user = await User.findOne({"email": req.tokenData.email})
        const image = await Image.findOne({
            _id: req.params.id,
            $or: [{"private": false}, {"owner": user._id}]
        })
        return res.status(200).jsonp(image);
    } catch (e) {
        return res.status(404).jsonp({"message": e.message})
    }
});

module.exports = router;
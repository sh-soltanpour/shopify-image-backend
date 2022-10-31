const express = require("express"),
    router = express.Router(),
    mongoose = require('mongoose'),
    User = mongoose.model("User"),
    Image = mongoose.model("Image"),
    tokenVerifier = require("../middleware/token_verification");

router.post("", tokenVerifier, async function (req, res) {
    try {
        const user = await User.findOne({"email": req.tokenData.email})
        const images = req.body.images.map(img =>
            new Image(
                {
                    title: img.title,
                    description: img.description,
                    owner: user._id,
                    link: img.link,
                    private: img.private
                }
            )
        )
        const savedImages = await Image.insertMany(images)

        return res.jsonp({
            savedImages
        });
    } catch
        (e) {
        return res.status(400).jsonp({"message": e.message})
    }
});

router.delete("", tokenVerifier, async function (req, res) {
    try {
        const user = await User.findOne({"email": req.tokenData.email})
        const idsToDelete = req.body.images.map(img => img.id);
        const deletedImages = await Image.deleteMany({
            _id: {
                $in: idsToDelete
            }, "owner": user._id,
        })
        return res.status(200).jsonp(deletedImages);
    } catch (e) {
        return res.status(404).jsonp({"message": e.message})
    }
});

module.exports = router;
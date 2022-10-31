const express = require("express"),
    router = express.Router(),
    images = require("./images"),
    bulkImages = require("./bulk");


router.use("/bulk", bulkImages);
router.use("/", images);

module.exports = router;
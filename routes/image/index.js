const express = require("express"),
    router = express.Router(),
    images = require("./images"),
    bulkImages = require("./bulk")
    searchImages = require("./search");


router.use("/bulk", bulkImages);
router.use("/search", searchImages);
router.use("/", images);

module.exports = router;
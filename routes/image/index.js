const express = require("express"),
    router = express.Router(),
    images = require("./images");

router.use("/", images);
// router.use("/register", register);

module.exports = router;
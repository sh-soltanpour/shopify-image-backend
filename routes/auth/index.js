const express = require("express"),
    router = express.Router(),
    login = require("./login"),
    register = require("./register");

router.use("/login", login);
router.use("/register", register);

module.exports = router;
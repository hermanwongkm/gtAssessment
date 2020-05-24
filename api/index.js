const express = require("express");

var router = express.Router();

router.use("/upload", require("./upload"));
router.use("/", require("./users"));

module.exports = router;

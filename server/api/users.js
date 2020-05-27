const express = require("express");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

var router = express.Router();
const controllers = require("../controllers/users");
const util = require("../controllers/util");

router.get("/", util.validateSortParams(), controllers.getEmployeesByParams);
router.post("/upload", upload.any(), controllers.uploadByCsv);
router.get("/:id", util.validateId(), controllers.getEmployee);
router.post("/:id", util.validateEmployee(), controllers.createEmployee);
router.patch("/:id", util.validateEmployee(), controllers.updateEmployee);
router.delete("/:id", util.validateId(), controllers.deleteEmployee);

module.exports = router;

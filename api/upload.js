const multer = require("multer");
const csv = require("csv-parser");
const express = require("express");
const streamifier = require("streamifier");

const router = express.Router();

// const upload = multer({ dest: 'uploads/' });

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./");
//   },
//   filename: function (req, file, cb) {
//     cb(null, "uploaded.csv");
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

router.post("/", upload.any(), (req, res) => {
  console.log("Uploading file");
  try {
    let stream = streamifier.createReadStream(req.files[0].buffer);
    stream
      .pipe(csv())
      .on("data", (row) => {
        console.log(row);
      })
      .on("end", () => {
        console.log("CSV file successfully processed");
      });
    // const csvString = req.files[0].buffer.toString();
    // console.log(csvString);
    res.send(req.files[0].buffer);
  } catch (err) {
    res.send(400);
  }
});

module.exports = router;

const multer = require("multer");
const csv = require("csv-parser");
const express = require("express");
const streamifier = require("streamifier");
const db = require("../models/index");

const util = require("./util");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.any(), async (req, res) => {
  try {
    //CSV data is currently stored in memory, thus read it and store it into an array
    let stream = streamifier.createReadStream(req.files[0].buffer);
    let csvData = [];
    let csvStream = csv()
      .on("data", async (row, t) => {
        console.log(Object.values(row)[0].charAt(0) === "#");
        //Check for comment, which is not part of validation
        if (Object.values(row)[0].charAt(0) !== "#") {
          csvData.push(row);
        }
      })
      .on("end", async () => {
        console.log("CSV file successfully processed");
      });

    await stream.pipe(csvStream);
    let x = await upsert(csvData);
    res.send(x);
  } catch (err) {
    console.log("Error in outer catch");
    res.status(400).send({ message: err.message });
  }
});

const upsert = async (csvData) => {
  try {
    const result = await db.sequelize.transaction(async (t) => {
      for (let i = 0; i < csvData.length; i++) {
        let employeeData = csvData[i];
        util.validateCsvRow(employeeData);

        const [employee, created] = await db.Employee.findOrCreate({
          where: { companyId: employeeData.id },
          defaults: {
            companyId: employeeData.id,
            login: employeeData.login,
            name: employeeData.name,
          },
          transaction: t,
        });
        //I will perform update if it exist already
        if (!created) {
          await employee.update({
            login: employeeData.login,
            name: employeeData.name,
          });
        }
      }
      return true;
    });
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = router;

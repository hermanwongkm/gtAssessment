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
    if (csvData.length === 0) {
      throw new Error("Empty file");
    }
    let result = await upsert(csvData);
    if (result) {
      return res.status(200).json({ message: "Sucuessfully updated" });
    }
  } catch (err) {
    console.log("Error in outer catch");
    console.log(err.message);
    res.status(400).send({ message: err.message });
  }
});

const upsert = async (csvData) => {
  try {
    const result = await db.sequelize.transaction(async (t) => {
      for (let i = 0; i < csvData.length; i++) {
        let employeeData = csvData[i];
        console.log(employeeData);
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

        if (created) {
          await db.Salary.create(
            {
              salary: employeeData.salary,
              employeeId: employee.id,
            },
            { transaction: t }
          );
          //Update both salary & employee infomation
        } else {
          await employee.update(
            {
              login: employeeData.login,
              name: employeeData.name,
            },
            { transaction: t }
          );
          const salary = await db.Salary.findOne(
            {
              where: { employeeId: employee.id },
            },
            { transaction: t }
          );
          await salary.update(
            {
              salary: employeeData.salary,
            },
            { transaction: t }
          );
        }
      }
      return true;
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = router;

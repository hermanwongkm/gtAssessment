const csv = require("csv-parser");
const { Op } = require("sequelize");
var AsyncLock = require("async-lock");
const streamifier = require("streamifier");
const { validationResult } = require("express-validator");

const db = require("../models/index");
const util = require("./util");

const lock = new AsyncLock();

/**
 * Endpoint to get users that matches query params
 */
const getEmployeesByParams = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const { minSalary, maxSalary, offset, sort, limit } = req.query;
  let ordering = util.computeSortOrder(sort);
  let employees = await db.Employee.findAll({
    raw: true,
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [ordering],
    attributes: [["companyId", "id"], "name", "login", "Salary.salary"],
    include: [
      {
        model: db.Salary,
        attributes: [],
        where: {
          salary: {
            [Op.and]: {
              [Op.gte]: minSalary,
              [Op.lte]: maxSalary,
            },
          },
        },
      },
    ],
  });
  return res.status(200).json({ results: employees });
};

/**
 * Endpoint to get employee by Id
 */
const getEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { id } = req.params;
  try {
    const employee = await db.Employee.findOne({
      where: { companyId: id },
      include: [
        {
          model: db.Salary,
        },
      ],
    });
    if (!employee) {
      res.status(400).json({ error: `Id ${id} does not exists` });
      return;
    }
    res.status(200).json(util.employeeDTO(employee, employee.Salary));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Endpoint to create a new employee
 */
const createEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  const { id } = req.params;
  const { login, name, salary } = req.body;
  try {
    const existId = await db.Employee.findOne({ where: { companyId: id } });
    if (existId) {
      res.status(400).json({ error: `Id ${id} already exists` });
      return;
    }
    const existLogin = await db.Employee.findOne({ where: { login } });
    if (existLogin) {
      res.status(400).json({ error: `login ${login} already exists` });
      return;
    }
    // Success
    const employee = await db.Employee.create({
      companyId: id,
      login,
      name,
    });

    const employeeSalary = await db.Salary.create({
      employeeId: employee.id,
      salary,
    });

    res.status(200).json(util.employeeDTO(employee, employeeSalary));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Endpoint to update employee details by id
 */
const updateEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  const { id } = req.params;
  const { login, name, salary } = req.body;

  try {
    const employee = await db.Employee.findOne({ where: { companyId: id } });
    if (!employee) {
      res.status(400).json({ error: `Id ${id} does not exists` });
      return;
    }
    await employee.update({
      login,
      name,
    });

    const employeeSalary = await db.Salary.findOne({
      where: { employeeId: employee.id },
    });
    await employeeSalary.update({
      salary,
    });
    res.status(200).json(util.employeeDTO(employee, employeeSalary));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Endpoint to delete employee by id
 */
const deleteEmployee = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }

  id = req.params.id;
  try {
    const employee = await db.Employee.findOne({ where: { companyId: id } });
    if (!employee) {
      res.status(400).json({ error: `Id ${id} does not exists` });
      return;
    }
    await employee.destroy({
      where: { companyId: id },
    });

    return res.status(200).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Endpoint to upload employees by CSV
 */
const uploadByCsv = async (req, res) => {
  try {
    //If another transction is in progress
    if (lock.isBusy()) {
      return res
        .status(400)
        .json({ message: "Another file is still being uploaded" });
    }
    lock.acquire("key", async (done) => {
      let stream = streamifier.createReadStream(req.files[0].buffer);
      let csvData = [];
      let csvStream = csv()
        .on("data", async (row, t) => {
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
        done();
        return res.status(400).send({ message: "Empty file not allowed" });
      }
      let result = await upsert(csvData, res);
      done();
      if (result) {
        return res.status(200).json({ message: "Sucuessfully uploaded" });
      }
    });
  } catch (err) {
    done();
    res.status(400).send({ message: err.message });
  }
};

/**
 * Function that updates if entry exists, else create a new employee
 */
const upsert = async (csvData, res) => {
  try {
    const result = await db.sequelize.transaction(async (t) => {
      for (let i = 0; i < csvData.length; i++) {
        util.validateCsvRow(csvData[i]);
        let [id, login, name, salary] = Object.values(csvData[i]);

        const [employee, created] = await db.Employee.findOrCreate({
          where: { companyId: id },
          defaults: {
            companyId: id,
            login,
            name,
          },
          transaction: t,
        });

        if (created) {
          await db.Salary.create(
            {
              salary,
              employeeId: employee.id,
            },
            { transaction: t }
          );
          //Update both salary & employee infomation
        } else {
          await employee.update(
            {
              login,
              name,
            },
            { transaction: t }
          );
          const salaryEntry = await db.Salary.findOne(
            {
              where: { employeeId: employee.id },
            },
            { transaction: t }
          );
          await salaryEntry.update(
            {
              salary,
            },
            { transaction: t }
          );
        }
      }
      return true;
    });
    return result;
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

module.exports = {
  getEmployeesByParams,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  uploadByCsv,
};

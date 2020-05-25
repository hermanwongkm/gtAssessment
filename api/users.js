const express = require("express");
const { Op } = require("sequelize");

const db = require("../models/index");
const util = require("./util");

//remember to add validator
const router = express.Router();

router.get("/", async (req, res) => {
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
});

//Get
router.get("/:id", async (req, res) => {
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
});

//Create
router.post("/:id", async (req, res) => {
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
});

//Update
router.patch("/:id", async (req, res) => {
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
});

//Delete
router.delete("/:id", async (req, res) => {
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
});

module.exports = router;

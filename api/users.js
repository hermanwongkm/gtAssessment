const express = require("express");
const { Op } = require("sequelize");
const db = require("../models/index");
const util = require("./util");

const router = express.Router();

router.get("/", async (req, res) => {
  const { minSalary, maxSalary, offset, sort, limit } = req.query;
  let ordering = util.computeSortOrder(sort);
  let employees = await db.Employee.findAll({
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [ordering],
    include: [
      {
        model: db.Salary,
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

  return res.status(200).json({ employee: employees });
});

module.exports = router;

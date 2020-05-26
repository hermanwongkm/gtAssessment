const { check } = require("express-validator");

const db = require("../models/index");

const SORT_ORDER = ["+", "-"];
const SORT_TYPE = ["name", "login", "id", "salary"];

const validateSortParams = () => {
  return [
    check("minSalary").isNumeric().withMessage("Must be numeric "),
    check("maxSalary").isNumeric().withMessage("Must be numeric "),
    check("offset").isNumeric().withMessage("Must be numeric "),
    check("limit").isNumeric().withMessage("Must be numeric "),
    check("sort")
      .custom((value) => {
        const order = value.substring(0, 1);
        if (SORT_ORDER.includes(order)) {
          const type = value.substring(1);
          return SORT_TYPE.includes(type);
        }
        return false;
      })
      .withMessage("In correct sort parameters "),
  ];
};

const validateId = () => {
  return [check("id").isAlphanumeric().withMessage("Must be alphanumeric")];
};

const validateEmployee = () => {
  return [
    check("id").isAlphanumeric().withMessage("Must be alphanumeric"),
    check("name").exists().withMessage("Must be alphanumeric"),
    check("login").isAlphanumeric().withMessage("Must be alphanumeric"),
    check("salary").isNumeric(),
    check("salary")
      .custom((value) => {
        if (value < 0) {
          return false;
        }
        return true;
      })
      .withMessage("Salary must be great than 0"),
  ];
};

const validateCsvRow = (row) => {
  if (Object.values(row).length !== 4) {
    throw new Error("Number of columns is not correct");
  }
  if (!Object.values(row)[0].match(/^[a-z0-9]+$/i)) {
    throw new Error("login must be alphanumeric");
  }
  if (!Object.values(row)[1].match(/^[a-z0-9]+$/i)) {
    throw new Error("id must be alphanumeric");
  }
  if (!parseFloat(Object.values(row)[3]) || isNaN(Object.values(row)[3])) {
    throw new Error("Salary is not a number");
  }
  if (Object.values(row)[3] < 0) {
    throw new Error("Salary is less than 0");
  }
};

const computeSortOrder = (sort) => {
  let ordering = [];
  let order = "ASC";
  if (sort.charAt(0) === "-") {
    order = "DESC";
  }
  if (sort.substring(1) === "salary") {
    ordering.push(db.Salary);
    ordering.push("salary");
  } else if (sort.substring(1) === "id") {
    ordering.push("companyId");
  } else {
    ordering.push(sort.substring(1));
  }
  ordering.push(order);
  return ordering;
};

const employeeDTO = (employee, salary) => {
  return {
    id: employee.companyId,
    name: employee.name,
    login: employee.login,
    salary: salary.salary,
  };
};

module.exports = {
  validateCsvRow,
  computeSortOrder,
  employeeDTO,
  validateId,
  validateEmployee,
  validateSortParams,
};

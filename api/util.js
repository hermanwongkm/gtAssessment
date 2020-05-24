const db = require("../models/index");

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
  console.log(sort.substring(1));
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

module.exports = {
  validateCsvRow,
  computeSortOrder,
};

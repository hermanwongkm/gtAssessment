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

module.exports = {
  validateCsvRow,
};

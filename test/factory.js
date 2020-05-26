const db = require("../models/index");
const faker = require("faker");

const util = require("../controllers/util");

const employeeFactory = async (data) => {
  const employee = await db.Employee.create({
    companyId: faker.random.alphaNumeric(5),
    login: faker.random.alphaNumeric(5),
    name: faker.name.lastName(),
  });
  const salary = await db.Salary.create({
    salary: faker.random.number(),
    employeeId: employee.id,
  });
  return util.employeeDTO(employee, salary);
};

const employeesFactory = async (data) => {
  let employees = [];

  for (let i = 0; i < 5; i++) {
    const employee = await db.Employee.create({
      companyId: faker.random.alphaNumeric(5),
      login: faker.random.alphaNumeric(5),
      name: faker.name.lastName(),
    });
    const salary = await db.Salary.create({
      salary: faker.random.number(5000),
      employeeId: employee.id,
    });
    employees.push(util.employeeDTO(employee, salary));
  }
  return employees;
};

module.exports = {
  employeeFactory,
  employeesFactory,
};

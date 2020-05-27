"use strict";
const uuid = require("uuid");
const faker = require("faker");

module.exports = {
  up: (queryInterface, Sequelize) => {
    var employees = [];
    var salaries = [];
    for (let i = 0; i < 50; i++) {
      const employeeSeed = {
        id: uuid.v4(),
        name: faker.name.lastName(),
        companyId: faker.random.alphaNumeric(10),
        login: faker.random.alphaNumeric(10),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const salarySeed = {
        id: uuid.v4(),
        employeeId: employeeSeed.id,
        salary: faker.random.number(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      employees.push(employeeSeed);
      salaries.push(salarySeed);
    }
    queryInterface.bulkInsert("Employees", employees, {});
    return queryInterface.bulkInsert("Salaries", salaries, {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Employees", null, {});
  },
};

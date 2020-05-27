const chai = require("chai");
const faker = require("faker");
const chatHttp = require("chai-http");

const factory = require("./factory");
const db = require("../models/index");
const app = require("../index");
chai.use(require("chai-sorted"));

chai.use(chatHttp);
const { expect } = chai;

const NONALPHANUMERIC = "ab$xy";

/**
 * Test for creating employee
 */

describe("Creating employee", () => {
  let seeds, validURL, randomId;

  beforeEach("setup seeds", async () => {
    seeds = {};
    seeds.employee = await factory.employeeFactory();
    randomId = faker.random.alphaNumeric(5);
    validURL = `/users/${randomId}`;
  });

  afterEach("Remove seeds", async () => {
    await db.Employee.destroy({ truncate: { cascade: true } });
  });

  it("should create a new employee if employee does not exist", (done) => {
    const validBody = {
      login: faker.random.alphaNumeric(5),
      name: faker.name.lastName(),
      salary: faker.random.number(),
    };
    chai
      .request(app)
      .post(validURL)
      .set("Content-Type", "application/json")
      .send(validBody)
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        const employee = await db.Employee.findOne({
          where: { companyId: randomId },
        });
        //Check if employee is inserted
        expect(employee).to.not.be.null;
        expect(employee.login).to.equal(validBody.login);
        done();
      });
  });
  it("should create a new employee if employee does not exist and salary is decimal", (done) => {
    const validBody = {
      login: faker.random.alphaNumeric(5),
      name: faker.name.lastName(),
      salary: faker.random.number(9000, 10000, 4),
    };
    chai
      .request(app)
      .post(validURL)
      .set("Content-Type", "application/json")
      .send(validBody)
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        const employee = await db.Employee.findOne({
          where: { companyId: randomId },
        });
        //Check if employee is inserted
        expect(employee).to.not.be.null;
        expect(employee.login).to.equal(validBody.login);
        done();
      });
  });

  it("should not create a new employee if employee already exist", (done) => {
    const validBody = {
      login: faker.random.alphaNumeric(5),
      name: faker.name.lastName(),
      salary: faker.random.number(),
    };
    const urlWithExistingId = `/users/${seeds.employee.id}`;
    chai
      .request(app)
      .post(urlWithExistingId)
      .set("Content-Type", "application/json")
      .send(validBody)
      .end((err, res) => {
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("should not create a new employee if id is not alphanumeric", (done) => {
    const validBody = {
      login: faker.random.alphaNumeric(5),
      name: faker.name.lastName(),
      salary: faker.random.number(),
    };
    const invalidURL = `/users/${NONALPHANUMERIC}`;
    chai
      .request(app)
      .post(invalidURL)
      .set("Content-Type", "application/json")
      .send(validBody)
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(400);
        done();
      });
  });
  it("should not create a new employee if salary is less than 0", (done) => {
    const validBody = {
      login: faker.random.alphaNumeric(5),
      name: faker.name.lastName(),
      salary: -2,
    };
    const invalidURL = `/users/${NONALPHANUMERIC}`;
    chai
      .request(app)
      .post(invalidURL)
      .set("Content-Type", "application/json")
      .send(validBody)
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(400);
        done();
      });
  });
});

/**
 * Test for updating employee
 */

describe("Updating employee", () => {
  let seeds, validURL, randomId;

  beforeEach("setup seeds", async () => {
    seeds = {};
    seeds.employee = await factory.employeeFactory();
    validURL = `/users/${seeds.employee.id}`;
  });

  afterEach("Remove seeds", async () => {
    await db.Employee.destroy({ truncate: { cascade: true } });
  });

  it("should update a existing employee if employee exist", (done) => {
    const validBody = {
      login: faker.random.alphaNumeric(5),
      name: faker.name.lastName(),
      salary: faker.random.number(),
    };
    chai
      .request(app)
      .patch(validURL)
      .set("Content-Type", "application/json")
      .send(validBody)
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        const employee = await db.Employee.findOne({
          where: { companyId: seeds.employee.id },
        });
        //Check if employee is updated
        expect(employee).to.not.be.null;
        expect(employee.login).to.equal(validBody.login);
        expect(employee.name).to.equal(validBody.name);
        const salary = await db.Salary.findOne({
          where: { employeeId: employee.id },
        });
        expect(salary.salary).to.equal(validBody.salary);
        done();
      });
  });

  it("should throw an error if parameters are missing", (done) => {
    const invalidBody = {
      login: faker.random.alphaNumeric(5),
      salary: faker.random.number(),
    };
    chai
      .request(app)
      .patch(validURL)
      .set("Content-Type", "application/json")
      .send(invalidBody)
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("should not update a existing employee if login is not alphanumeric", (done) => {
    const invalidBody = {
      login: NONALPHANUMERIC,
      name: faker.random.alphaNumeric(5),
      salary: faker.random.number(),
    };
    chai
      .request(app)
      .patch(validURL)
      .set("Content-Type", "application/json")
      .send(invalidBody)
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(400);
        done();
      });
  });
});

/**
 * Test for getting an employee
 */

describe("Get an employee", () => {
  let seeds, validURL;

  beforeEach("setup seeds", async () => {
    seeds = {};
    seeds.employee = await factory.employeeFactory();
    validURL = `/users/${seeds.employee.id}`;
  });

  afterEach("Remove seeds", async () => {
    await db.Employee.destroy({ truncate: { cascade: true } });
  });

  it("should get a existing employee", (done) => {
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        expect(res.body).to.eql(seeds.employee);
        done();
      });
  });

  it("should throw an error if id does not exist", (done) => {
    const invalidURL = `/users/${faker.random.alphaNumeric(5)}`;
    chai
      .request(app)
      .get(invalidURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(400);
        done();
      });
  });
});

/**
 * Test for deleting employee
 */

describe("Delete employee", () => {
  let seeds, validURL;

  beforeEach("setup seeds", async () => {
    seeds = {};
    seeds.employee = await factory.employeeFactory();
    validURL = `/users/${seeds.employee.id}`;
  });

  afterEach("Remove seeds", async () => {
    await db.Employee.destroy({ truncate: { cascade: true } });
  });

  it("should delete a existing employee", (done) => {
    chai
      .request(app)
      .delete(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        const employee = await db.Employee.findOne({
          where: { companyId: seeds.employee.id },
        });
        //Check if employee is updated
        expect(employee).to.be.null;
        done();
      });
  });

  it("should throw an error if id does not exist", (done) => {
    const invalidURL = `/users/${faker.random.alphaNumeric(5)}`;
    chai
      .request(app)
      .delete(invalidURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(400);
        done();
      });
  });
});

/**
 * Test for getting all employees under selected params
 */

describe("Get all employee in the correct sorted order and under a certain param", () => {
  let seeds, validURL;
  beforeEach("setup seeds", async () => {
    seeds = await factory.employeesFactory();
  });

  afterEach("Remove seeds", async () => {
    await db.Employee.destroy({ truncate: { cascade: true } });
  });

  it("should get all employees with sorted ascending name", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12312&offset=0&sort=%2bname`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        //check sort order
        let employees = res.body.results;
        expect(employees).to.be.sortedBy("name");
        done();
      });
  });

  it("should get all employees with sorted ascending id", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12312&offset=0&sort=%2bid`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        //check sort order
        let employees = res.body.results;
        expect(employees).to.be.sortedBy("id");
        done();
      });
  });

  it("should get all employees with sorted ascending salary", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12312&offset=0&sort=%2bsalary`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        //check sort order
        let employees = res.body.results;
        expect(employees).to.be.sortedBy("salary");
        done();
      });
  });

  it("should get all employees with sorted ascending login", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12312&offset=0&sort=%2blogin`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        //check sort order
        let employees = res.body.results;
        expect(employees).to.be.sortedBy("login");
        done();
      });
  });

  it("should get all employees with sorted descending login", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12312&offset=0&sort=-login`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        //check sort order
        let employees = res.body.results;
        expect(employees).to.be.sortedBy("login", { descending: true });
        done();
      });
  });

  it("should get all employees with sorted descending id", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12312&offset=0&sort=-id`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        //check sort order
        let employees = res.body.results;
        expect(employees).to.be.sortedBy("id", { descending: true });
        done();
      });
  });

  it("should get all employees with sorted descending name", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12312&offset=0&sort=-name`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        //check sort order
        let employees = res.body.results;
        expect(employees).to.be.sortedBy("name", { descending: true });
        done();
      });
  });

  it("should get all employees with sorted descending salary", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12312&offset=0&sort=-salary`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(200);
        //check sort order
        let employees = res.body.results;
        expect(employees).to.be.sortedBy("salary", { descending: true });
        done();
      });
  });

  it("should throw an error if there is missing parameters", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12312&sort=-login`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(400);
        done();
      });
  });

  it("should throw an error if there is incorrect parameters", (done) => {
    validURL = `/users?limit=30&maxSalary=5000&minSalary=4.12a312&sort=-login`;
    chai
      .request(app)
      .get(validURL)
      .set("Content-Type", "application/json")
      .send()
      .end(async (err, res) => {
        //Check correct response
        expect(res.status).to.equal(400);
        done();
      });
  });
});

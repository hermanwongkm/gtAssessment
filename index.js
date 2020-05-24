const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const api = require("./api");

const app = express();

console.log(app.get("env"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users", api);

const models = require("./models/index");

// simple route
app.get("/", async (req, res) => {
  const user = await models.Employee.create({
    login: "asd",
    companyId: "xyz",
    name: "test",
  });
  // let teachers = await models.Employee.findAll({
  //   raw: true,
  // });
  // console.log(teachers);
  // return res.status(200).json({ students: teachers });
});

// Start server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening`);
});

module.exports = app;

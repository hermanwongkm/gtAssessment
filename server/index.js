const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");

const api = require("./api/users");

const app = express();

console.log(app.get("env"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/users", api);

// Start server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening`);
});

module.exports = app;

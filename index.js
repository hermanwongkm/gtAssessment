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

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder applicataion." });
});

// Start server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server listening`);
});

module.exports = app;

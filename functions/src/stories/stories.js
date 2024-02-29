const express = require("express");
const cors = require("cors");
const requests = require("./requests");

const app = express();

const corsOptions = {
  origin: true,
};
app.use(cors(corsOptions));
app.use("/", requests);

module.exports = app;

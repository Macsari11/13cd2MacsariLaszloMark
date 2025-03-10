const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(cors());


app.listen(3001, () => {
    console.log("A szerver fut a 3001-es porton");
});
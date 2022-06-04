const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const session = require("express-session");

const app = express();

const name = "ManojM";

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

const port = process.env.PORT || 8000;

app.set("port", port);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static("images"));

app.get("/", (req, res, next) => {
  res.render("index.ejs", { title: "Airline reservation" });
});

fs.writeFile("file.txt", name, () => {
  console.log("Writed");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});

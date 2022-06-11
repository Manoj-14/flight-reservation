const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const loginCheckMiddleWare = require("./middlewareLogin");

const app = express();

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
app.use(express.json());
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.static("images"));
app.use(cookieParser());

const { userReg, userLogin, fetchFlights } = require("./routes/users");
const {
  userDash,
  adminDash,
  userproj,
  uptPass,
} = require("./routes/dashboard");

app.get("/", (req, res, next) => {
  res.render("index.ejs", {
    title: "Airline reservation",
    main: true,
    adminDash: false,
    userDash: false,
  });
});

app.all("/register", (req, res) => {
  res.render("register.ejs", {
    title: "Register",
    main: true,
    adminDash: false,
    userDash: false,
  });
});

app.all("/login", (req, res) => {
  res.render("login.ejs", {
    title: "Login",
    main: true,
    adminDash: false,
    userDash: false,
    msg: false,
  });
});

app.all("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.all("/userdashboard", userDash);
app.all("/admindashboard", adminDash);

app.all("/loginAuth", userLogin);
app.all("/regUser", userReg);
app.all("/fetchFlights", fetchFlights);
app.all("/userprofile", userproj);
app.all("/upt-pass", uptPass);

app.listen(port, () => {
  console.log("Listening to port", port);
});

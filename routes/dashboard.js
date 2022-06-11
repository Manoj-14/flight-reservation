const fs = require("fs");
const path = require("path");
const getDataFromFile = require("../getDataFromFile");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
const defaultList = [
  {
    id: "admin",
    name: "admin",
    password: "admin",
    Phone: "1234567890",
    accessCode: 1,
  },
];
module.exports = {
  userDash: (req, res) => {
    var session = req.session;
    console.log(req.session);
    if (session.user) {
      // res.json(session.user);
      res.render("user/userdashboard.ejs", {
        title: "User Dashboard",
        main: false,
        adminDash: false,
        userDash: true,
        name: session.user,
      });
    } else {
      res.redirect("/login");
    }
  },
  adminDash: (req, res) => {
    var session = req.session;
    console.log(req.session);
    if (session.user) {
      // res.json(session.user);
      res.render("adminDashboard.ejs", {
        title: "Admin Dashboard",
        main: false,
        adminDash: true,
        userDash: false,
        name: session.user,
      });
    } else {
      res.redirect("/login");
    }
  },
  userproj: (req, res) => {
    var session = req.session;
    const id = session.user;
    if (session.user) {
      let data = getDataFromFile("./files/userInfo.txt", defaultList);
      data = JSON.parse(data);
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          res.status(200).render("user/userprofile.ejs", {
            title: "User Profile",
            main: false,
            adminDash: false,
            userDash: true,
            user: session.user,
            name: data[i].name,
            phone: data[i].phone,
          });
          return;
        }
      }
      res.status(404).send("User not found");
    } else {
      res.redirect("/logout");
    }
  },
  uptPass: async (req, res) => {
    var session = req.session;
    const id = session.user;
    const { oldPassword, newPassword } = req.body;
    // console.log(req.body);
    if (session.user) {
      let data = getDataFromFile("./files/userInfo.txt", defaultList);
      data = JSON.parse(data);
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          let matchPass = await bcrypt.compareSync(
            oldPassword,
            data[i].password
          );
          if (matchPass) {
            const hashedPassword = await bcrypt.hashSync(newPassword, salt);
            data[i].password = hashedPassword;
            fs.writeFileSync("./files/userInfo.txt", JSON.stringify(data));
            res.status(200).redirect("/userprofile");
            return;
          }
          // res.status(200).render("user/updatePassword.ejs", {
          //   title: "Update Password",
          //   main: false,
          //   adminDash: false,
          //   userDash: true,
          //   user: session.user,
          //   name: data[i].name,
          //   phone: data[i].phone,
          // });
        }
      }
      res.status(404).send("User not found");
    } else {
      res.redirect("/logout");
    }
  },
};

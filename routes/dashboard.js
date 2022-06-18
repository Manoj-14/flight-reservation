const fs = require("fs");
const path = require("path");
const getDataFromFile = require("../getDataFromFile");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxx-xxy-xyx-yxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}
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
  flightBooked: (req, res) => {
    console.log(req.body);
    res.send(req.body);
  },
  paidConfirm: (req, res) => {
    var session = req.session;
    let data = new String();
    // const numOfSeates = req.body.numOfSeates;

    if (session.user) {
      const { numOfSeats, name, flightName, flightCode, arrTime, deptTime } =
        req.body;
      var ticketnum;

      try {
        data = fs.readFileSync("./files/booked.txt", {
          encoding: "utf8",
          flag: "r",
        });
      } catch (error) {
        fs.writeFileSync("./files/booked.txt", JSON.stringify([]));
        data = JSON.stringify([]);
        console.log(error);
      }
      data = JSON.parse(data);

      try {
        data.push({
          ticketnum: create_UUID(),
          user: session.user,
          numOfSeats,
          name,
          flightName,
          flightCode,
          arrTime,
          deptTime,
          paymentSts: "Paid",
          cancelation: 0,
        });
        fs.writeFileSync("./files/booked.txt", JSON.stringify(data));
        res.send("Paid Thank you");
      } catch (error) {
        console.log(error);
      }
    } else {
      res.redirect("/logout");
    }
  },
  saveBooking: (req, res) => {
    var session = req.session;
    let data = new String();
    // const numOfSeates = req.body.numOfSeates;

    if (session.user) {
      const { numOfSeats, name, flightName, flightCode, arrTime, deptTime } =
        req.body;
      var ticketnum;

      try {
        data = fs.readFileSync("./files/bookingSaved.txt", {
          encoding: "utf8",
          flag: "r",
        });
      } catch (error) {
        fs.writeFileSync("./files/bookingSaved.txt", JSON.stringify([]));
        data = JSON.stringify([]);
        console.log(error);
      }
      data = JSON.parse(data);

      try {
        data.push({
          ticketnum: create_UUID(),
          user: session.user,
          numOfSeats,
          name,
          flightName,
          flightCode,
          arrTime,
          deptTime,
          paymentSts: "Saved",
          delete: 0,
        });
        fs.writeFileSync("./files/bookingSaved.txt", JSON.stringify(data));
        res.send("Saved Thank you");
      } catch (error) {
        console.log(error);
      }
    } else {
      res.redirect("/logout");
    }
  },
};

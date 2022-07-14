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

function create_saved_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxx-xyx-yxx".replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function checkValidity(date) {
  const today = new Date();
  if (today.toDateString() === date.toDateString()) {
    return 0;
  } else if (today < date) {
    return 2;
  } else {
    return 1;
  }

  return false;
}
console.log(checkValidity(new Date("2022-01-10")));
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
        name: session.name,
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
      res.render("admin/adminDashboard.ejs", {
        title: "Admin Dashboard",
        main: false,
        adminDash: true,
        userDash: false,
        name: session.name,
      });
    } else {
      res.redirect("/login");
    }
  },
  userproj: (req, res) => {
    var session = req.session;
    const id = session.user;
    const histArr = [];
    if (session.user) {
      let data = getDataFromFile("./files/userInfo.txt", defaultList);
      let histData = getDataFromFile("./files/booked.txt", defaultList);

      data = JSON.parse(data);
      histData = JSON.parse(histData);

      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          for (let j = 0; j < histData.length; j++) {
            histArr.push(histData[j]);
          }
          console.log(histArr);
          res.status(200).render("user/userprofile.ejs", {
            title: "User Profile",
            main: false,
            adminDash: false,
            userDash: true,
            user: session.user,
            name: data[i].name,
            phone: data[i].phone,
            histArr: histArr,
            length: histArr.length,
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
      const {
        numOfSeats,
        name,
        flightName,
        flightCode,
        deptDate,
        arrTime,
        deptTime,
      } = req.body;
      var ticketnum;
      console.log(req.body);

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
          deptDate,
          arrTime,
          deptTime,
          paymentSts: "Paid",
          cancelation: 0,
        });
        fs.writeFileSync("./files/booked.txt", JSON.stringify(data));
        res.redirect("/userpaid");
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
      const {
        numOfSeats,
        name,
        flightName,
        flightCode,
        deptDate,
        arrTime,
        deptTime,
      } = req.body;
      var ticketnum;
      console.log(req.body);
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
          ticketnum: create_saved_UUID(),
          user: session.user,
          numOfSeats,
          name,
          flightName,
          flightCode,
          deptDate,
          arrTime,
          deptTime,
          paymentSts: "Saved",
          delete: 0,
        });
        fs.writeFileSync("./files/bookingSaved.txt", JSON.stringify(data));
        res.redirect("/usrbooking");
      } catch (error) {
        console.log(error);
      }
    } else {
      res.redirect("/logout");
    }
  },
  savedHistory: (req, res) => {
    var session = req.session;
    var history = [];
    if (session.user) {
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
      for (let i = 0; i < data.length; i++) {
        if (data[i].user === session.user && data[i].delete === 0) {
          history.push(data[i]);
        }
      }
      res.status(200).render("user/booking-saved.ejs", {
        title: "Saved Bookings",
        length: history.length,
        history,
        main: false,
        adminDash: false,
        userDash: true,
        name: session.user,
      });
    } else {
      res.redirect("/logout");
    }
  },
  userHistory: (req, res) => {
    var session = req.session;
    var history = [];
    if (session.user) {
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
      for (let i = 0; i < data.length; i++) {
        if (data[i].user === session.user && data[i].cancelation === 0) {
          data[i].expSts = checkValidity(new Date(data[i].deptDate));
          history.push(data[i]);
          console.log(data[i].deptDate);
        }
      }
      console.log(history);
      res.status(200).render("user/booking-history.ejs", {
        title: "User History",
        length: history.length,
        history,
        main: false,
        adminDash: false,
        userDash: true,
        name: session.user,
      });
    } else {
      res.redirect("/logout");
    }
  },
  canceltrip: (req, res) => {
    var session = req.session;
    const { ticketNum } = req.body;

    if (session.user) {
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
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].user === session.user &&
          data[i].cancelation === 0 &&
          data[i].ticketnum == ticketNum
        ) {
          data[i].cancelation = 1;
          fs.writeFileSync("./files/booked.txt", JSON.stringify(data));
          console.log(ticketNum);
        }
      }
      res.redirect("/userpaid");
    }
  },
  paySaved: (req, res) => {
    var session = req.session;
    const { ticketNum } = req.body;

    if (session.user) {
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
      try {
        sData = fs.readFileSync("./files/bookingSaved.txt", {
          encoding: "utf8",
          flag: "r",
        });
      } catch (error) {
        fs.writeFileSync("./files/bookingSaved.txt", JSON.stringify([]));
        sData = JSON.stringify([]);
        console.log(error);
      }
      data = JSON.parse(data);
      sData = JSON.parse(sData);
      for (let i = 0; i < sData.length; i++) {
        if (
          sData[i].user === session.user &&
          sData[i].delete === 0 &&
          sData[i].ticketnum == ticketNum
        ) {
          data.push({
            ticketnum: create_UUID(),
            user: sData[i].user,
            numOfSeats: sData[i].numOfSeats,
            name: sData[i].name,
            flightName: sData[i].flightName,
            flightCode: sData[i].flightCode,
            arrTime: sData[i].arrTime,
            deptTime: sData[i].deptTime,
            paymentSts: "Paid",
            cancelation: 0,
          });
          sData.splice(i, 1);
          fs.writeFileSync("./files/booked.txt", JSON.stringify(data));
          fs.writeFileSync("./files/bookingSaved.txt", JSON.stringify(sData));
          console.log(ticketNum);
        }
      }
      res.redirect("/usrbooking");
    }
  },
  rmSaved: (req, res) => {
    var session = req.session;
    const { ticketNum } = req.body;

    if (session.user) {
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
      for (let i = 0; i < data.length; i++) {
        if (
          data[i].user === session.user &&
          data[i].delete === 0 &&
          data[i].ticketnum == ticketNum
        ) {
          data[i].delete = 1;
          fs.writeFileSync("./files/bookingSaved.txt", JSON.stringify(data));
          console.log(ticketNum);
        }
      }
      res.redirect("/usrbooking");
    }
  },
};

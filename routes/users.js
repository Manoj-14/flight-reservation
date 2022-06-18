const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const getDataFromFile = require("../getDataFromFile");
var request = require("request");
var salt = bcrypt.genSaltSync(10);
const https = require("https");
var session;
addToArray = (intoArr, addElem) => {
  intoArr.push(addElem);
  return intoArr;
};
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
  userReg: async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const password = req.body.password;
    const phone = req.body.phone;
    const accessCode = 0;
    // const { name, id, password ,accessCode} = {};
    // console.log(name, id, password);
    let data = new String();

    try {
      data = fs.readFileSync("./files/userInfo.txt", {
        encoding: "utf8",
        flag: "r",
      });
    } catch (error) {
      fs.writeFileSync("./files/userInfo.txt", JSON.stringify(defaultList));
      data = JSON.stringify(defaultList);
      console.log(error);
    }
    data = JSON.parse(data);
    console.log(data);

    let i;
    for (i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        res.send("Already registerd ");
        return;
      }
    }

    try {
      const hashedPassword = await bcrypt.hashSync(password, salt);
      data.push({ id, password: hashedPassword, name, phone, accessCode });
      fs.writeFileSync("./files/userInfo.txt", JSON.stringify(data));
      res.render("login.ejs", {
        title: "Login",
        main: true,
        adminDash: false,
        userDash: false,
        msg: true,
        status: "success",
        message: "You had registered please login",
      });
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "NOT WORKING FINE" });
      return;
    }
  },

  userLogin: async (req, res) => {
    console.log(req.body);
    session = req.session;
    session.user = req.body.id;

    try {
      const { id, password } = req.body;

      let data = getDataFromFile("./files/userInfo.txt", defaultList);
      data = JSON.parse(data);
      let flag = false;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          flag = true;
          let matchPass = await bcrypt.compareSync(password, data[i].password);
          if (matchPass) {
            if (data[i].accessCode === 0) {
              res.status(200).redirect("/userdashboard");
            } else {
              res.status(200).redirect("/admindashboard");
            }
            return;
          } else {
            res
              .setHeader("Set-Cookie", ["token=; HttpOnly", "userName="])
              .json({ message: "Wrong Password" });
            return;
          }
        }

        // console.log(flag);
      }
      res
        .setHeader("Set-Cookie", ["token=; HttpOnly", "userName="])
        .json({ message: "No such User Found" });
      return;
    } catch (error) {
      res.status(401).json({ message: "Error" });
      console.log(error);
    }
  },
  fetchFlights: (req, res) => {
    var session = req.session;
    if (session.user) {
      const { from, to, date } = req.body;

      if (from && date && to) {
        var mydate = new Date(date);
        const day = mydate.getDate();
        const month = mydate.getMonth() + 1;
        const year = mydate.getFullYear();
        mydate = year + "/" + month + "/" + day;
        const felDetUrl = `https://api.flightstats.com/flex/schedules/rest/v1/json/from/${from}/to/${to}/arriving/${mydate}?appId=76e0bd85&appKey=2008cfc23be0eb1d16514863fa356a02&Access-Control-Allow-Origin=*`;
        var FligOptions = {
          method: "GET",
          url: felDetUrl,
          headers: {
            appId: "76e0bd85",
            appKey: "2008cfc23be0eb1d16514863fa356a02",
          },
        };

        request(FligOptions, function (error, response) {
          if (error) throw new Error(error);
          data = JSON.parse(response.body);
          var flightName;
          var flightNameArr = [];
          for (var i = 0; i < data.scheduledFlights.length; i++) {
            var options = {
              method: "GET",
              url: `https://api.flightstats.com/flex/airlines/rest/v1/json/fs/${data.scheduledFlights[i].carrierFsCode}?appId=76e0bd85&appKey=2008cfc23be0eb1d16514863fa356a02`,
              headers: {
                appId: "76e0bd85",
                appKey: "2008cfc23be0eb1d16514863fa356a02",
              },
            };
            // request(options, function (error, flgResponse) {
            //   if (error) throw new Error(error);
            //   flightName = JSON.parse(flgResponse.body);
            //   flightNameArr.push(flightName.airline.name);
            // });
            https.get(options.url, function (fligRes) {
              fligRes.on("data", function (chunk) {
                flightName = JSON.parse(chunk);
                flightNameArr.push(flightName);
              });
            });
            console.log(flightNameArr);
          }
          console.log(flightNameArr);
          const length = data.scheduledFlights.length;
          var flights = [];
          flights = data.scheduledFlights;
          res.status(200).render("user/booking.ejs", {
            title: "Booking",
            length: length,
            flights,
            flightNameArr,
            main: false,
            adminDash: false,
            userDash: true,
            name: session.user,
          });
        });
      } else {
        res.status(401).redirect("/userdashboard");
      }
    } else {
      res.status(401).redirect("/login");
    }
  },
};

const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const getDataFromFile = require("../getDataFromFile");
var salt = bcrypt.genSaltSync(10);
const defaultList = [
  {
    id: "admin",
    name: "admin",
    password: "admin",
  },
];
module.exports = {
  userReg: async (req, res) => {
    const { id, password, name } = {
      id: "Manoj",
      password: "admin",
      name: "Manoj",
    };

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
    console.log(data.length);

    console.log(id, password, name);
    let i;
    for (i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        res.send("Already registerd ");
        return;
      }
    }

    try {
      const hashedPassword = await bcrypt.hashSync(password, salt);
      data.push({ id, password: hashedPassword, name });
      fs.writeFileSync("./files/userInfo.txt", JSON.stringify(data));
      res
        .setHeader("Set-Cookie", [
          "token=encryptedstring; HttpOnly",
          `userName=${data[i].id}`,
        ])
        .json({
          message: "Signed up Succesfully",
          id,
          password: hashedPassword,
        });
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "NOT WORKING FINE" });
      return;
    }
  },

  userLogin: async (req, res) => {
    try {
      const { id, password, name } = {
        id: "Manoj",
        password: "admin",
        name: "Manoj",
      };

      let data = getDataFromFile("./files/userInfo.txt", defaultList);
      data = JSON.parse(data);
      let flag = false;
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          flag = true;
          let matchPass = await bcrypt.compareSync(password, data[i].password);
          if (matchPass) {
            res
              .setHeader("Set-Cookie", [
                "token=encryptedstring; HttpOnly",
                `userName=${data[i].id}`,
              ])
              .json({ message: "Logged in", userName: id });
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
};

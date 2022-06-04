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
      id: "Manu",
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
    }
    data = JSON.parse(data);
    console.log(data);

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
      return;
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: "NOT WORKING FINE" });
      return;
    }
    // res.send("Registered");
  },
};

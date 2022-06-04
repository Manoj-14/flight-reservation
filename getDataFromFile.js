const fs = require("fs");

const getDataFromFile = (address, defaultList) => {
  let data = new String();
  try {
    data = fs.readFileSync(address, { encoding: "utf8", flag: "r" });
  } catch (error) {
    fs.writeFileSync(address, JSON.stringify(defaultList));
    data = JSON.stringify(defaultList);
  }

  return data;
};

module.exports = getDataFromFile;

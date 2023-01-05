const moment = require("moment");

const parseInput = (input) => {
  let isDateFound = false;
  let isTokenFound = false;
  let date = "";
  let token = "";
  var splitedInput = input.split(",");
  splitedInput.forEach((element) => {
    let [k, v] = element.split("=");
    if (k.toLowerCase() === "date") {
      if (moment(v, "DD-MM-YYYY", true).isValid()) {
        isDateFound = true;
        date = v;
      } else {
        console.log("invalid date format");
        return;
      }
    } else if (k.toLowerCase() === "token") {
      isTokenFound = true;
      token = v;
    }
  });
  return {
    isDateFound: isDateFound,
    isTokenFound: isTokenFound,
    date: date,
    token: token,
  };
};

const getDate = (date) => {
  const splitedDate = date.split("-");
  const year = parseInt(splitedDate[2]);
  const month = parseInt(splitedDate[1]) - 1;
  const day = parseInt(splitedDate[0]);
  // here date set to begining midnight of the day
  const startDate = new Date(Date.UTC(year, month, day, 0, 0, 0));
  const endDate = new Date(Date.UTC(year, month, day + 1, 0, 0, 0));
  return {
    startDate: startDate,
    endDate: endDate,
  };
};

const getLatestDateStamp = (date) => {
  var year = date.getFullYear();
  let month = date.getMonth();
  var day = date.getDate();
  // here date set to begining midnight of the day
  return new Date(Date.UTC(year, month, day, 0, 0, 0));
};

module.exports = { parseInput, getDate, getLatestDateStamp };

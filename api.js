const axios = require("axios");
const API_KEY =
  "Apikey 3d6b5482786c1e3087912b598fe0d5c432ed5b4535389d1b27958cffc662919c";

const getUSDbyToken = async (token, date) => {
  var config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // Authorization: API_KEY,
    },
  };
  return await axios
    .post(
      `https://min-api.cryptocompare.com/data/pricehistorical?fsym=${token}&tsyms=USD&ts=${
        date.valueOf() / 1000
      }`,
      {},
      config
    )
    .then((response) => {
      return response.data;
    })
    .catch(() => console.log("Error While Fetching USD Value"));
};

module.exports = { getUSDbyToken };

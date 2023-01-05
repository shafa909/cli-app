#!/usr/bin/env node

const readline = require("readline");
const { MongoClient } = require("mongodb");
const URI = "mongodb://localhost:27017/";
const { getUSDbyToken } = require("./api");
const { parseInput, getDate, getLatestDateStamp } = require("./utils");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter date or token or exit >> ",
});
let _db;

const connectDB = async () => {
  console.log("Connecting to database....");
  MongoClient.connect(
    URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, db) => {
      if (err) console.log("error while connecting with db");
      _db = db;
      console.log("Connected");
      rl.prompt();
    }
  );
};

const handleInput = async (input) => {
  const { isDateFound, isTokenFound, date, token } = parseInput(input);
  if (isDateFound && isTokenFound) {
    await getTransactionByDateAndToken(date, token);
  } else if (isDateFound) {
    await getTransactionByDate(date);
  } else if (isTokenFound) {
    await getLatestTransactionsByToken(token);
  } else {
    console.log("please enter a valid input");
  }
};

const getTransactionByDateAndToken = async (date, token) => {
  const { startDate, endDate } = getDate(date);
  const transactions = _db.db("crypto").collection("transac");
  let transacData;
  try {
    console.log("fetching data by token and date.....");
    console.log("------------------------------------");
    transacData = await transactions
      .find({
        timestamp: { $gte: startDate, $lt: endDate },
        token: token.toUpperCase().replace(/,/g, ""),
      })
      .toArray();
  } catch {
    console.log("error, while fetching data from db");
  }
  if (!transacData.length) {
    console.log("*** No data found for given date and token ***");
    rl.prompt();
  } else {
    await getPortfolioBySingleToken(transacData, token, startDate);
  }
};

const getTransactionByDate = async (date) => {
  const { startDate, endDate } = getDate(date);
  const transactions = _db.db("crypto").collection("transac");
  let transacData;
  try {
    console.log("fetching data by date.....");
    console.log("--------------------------");
    transacData = await transactions
      .find({
        timestamp: { $gte: startDate, $lt: endDate },
      })
      .toArray();
  } catch {
    console.log("error, while fetching data from db");
  }
  if (!transacData.length) {
    console.log("*** No data found for given date and token ***");
    rl.prompt();
  } else {
    await getPortfolioByMultipleToken(transacData, startDate);
  }
};

const getLatestTransactions = async () => {
  const transactions = _db.db("crypto").collection("transac");
  let transacData;
  let dateStamp;
  try {
    console.log("fetching latest data.....");
    console.log("-------------------------");
    let latestData = await transactions.findOne({});
    dateStamp = getLatestDateStamp(latestData.timestamp);
    transacData = await transactions
      .find({
        timestamp: { $gte: dateStamp },
      })
      .toArray();
  } catch {
    console.log("error, while fetching data from db");
  }
  await getPortfolioByMultipleToken(transacData, dateStamp);
};

const getLatestTransactionsByToken = async (token) => {
  const transactions = _db.db("crypto").collection("transac");
  let transacData;
  let dateStamp;
  try {
    console.log("fetching latest data by token.....");
    console.log("----------------------------------");
    let latestData = await transactions.findOne({
      token: token.toUpperCase().replace(/,/g, ""),
    });
    dateStamp = getLatestDateStamp(latestData.timestamp);
    transacData = await transactions
      .find({
        timestamp: { $gte: dateStamp },
        token: token.toUpperCase(),
      })
      .toArray();
  } catch (err) {
    console.log("error, while fetching data from db", err);
  }
  await getPortfolioBySingleToken(transacData, token, dateStamp);
};

const getPortfolioBySingleToken = async (transacData, token, dateStamp) => {
  let deposit = 0;
  let withdrawal = 0;
  transacData.forEach((element) => {
    if (element.transaction_type === "DEPOSIT") {
      deposit += element.amount;
    } else if (element.transaction_type === "DWITHDRAWALPOSIT") {
      withdrawal += element.amount;
    }
  });
  const usdValue = await getUSDbyToken(token, dateStamp);

  // there is some very old transaction data, eg : BTC deposit in 2000,
  // in this case we cannot fetch USD value.
  if (usdValue[token.toUpperCase()].USD === 0)
    return console.log("not able to find USD value of token in given date");

  console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
  console.log(
    `Portfolio : ${(
      (deposit - withdrawal) *
      usdValue[token.toUpperCase()].USD
    ).toFixed(4)}$`
  );
  console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
};

const getPortfolioByMultipleToken = async (transacData, dateStamp) => {
  let tokenMap = new Map();
  transacData.forEach(async (elem) => {
    if (!tokenMap.has(elem.token)) {
      tokenMap.set(elem.token, {
        withdrawal: elem.transaction_type === "WITHDRAWAL" ? elem.amount : 0,
        deposit: elem.transaction_type === "DEPOSIT" ? elem.amount : 0,
      });
    } else {
      if (elem.transaction_type === "DEPOSIT") {
        tokenMap.get(elem.token).deposit += elem.amount;
      } else if (elem.transaction_type === "WITHDRAWAL") {
        tokenMap.get(elem.token).withdrawal += elem.amount;
      }
    }
  });
  let deposit = 0;
  let withdrawal = 0;
  for (const obj of tokenMap) {
    const key = obj[0];
    const value = obj[1];
    const usdValue = await getUSDbyToken(key, dateStamp);

    // there is some very old transaction data, eg : BTC deposit in 2000,
    // in this case we cannot fetch USD value.
    if (usdValue[key].USD === 0) {
      console.log("not able to find USD value of token in given date");
      return;
    }
    withdrawal += value.withdrawal * usdValue[key].USD;
    deposit += value.deposit * usdValue[key].USD;
  }
  console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
  console.log(`Portfolio : ${(deposit - withdrawal).toFixed(4)}$`);
  console.log("*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*");
};

connectDB();

rl.on("line", async (line) => {
  if (line.toLowerCase() === "exit") {
    console.log("\nExiting!\n");
    process.exit(0);
  } else if (line.trim() === "") {
    console.log("---------------------------");
    console.log("Loading...");
    await getLatestTransactions();
  } else {
    console.log("---------------------------");
    console.log("Loading...");
    await handleInput(line.trim());
  }
  rl.prompt();
}).on("close", () => {
  process.exit(0);
});

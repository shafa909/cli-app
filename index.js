#!/usr/bin/env node

const readline = require("readline");
const { MongoClient } = require("mongodb");
const URI = "mongodb://localhost:27017/";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "Enter your input>",
});
let _db;

const connectDB = async () => {
  console.log("Connecting to database....");
  MongoClient.connect(
    URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    async (err, db) => {
      if (err) console.log('error while connecting with db');
      _db = db;
      console.log("Connected");
      rl.prompt();
    }
  );
};

connectDB();

rl.on("line", async (line) => {
  if (line.toLowerCase() === "exit") {
    console.log("\nExiting!\n");
    process.exit(0);
  } else if (line.trim() === "") {
    console.log("Loading...1");
  } else {
    console.log("Loading...2");
  }
  rl.prompt();
}).on("close", () => {
  console.log("Exiting!");
  process.exit(0);
});

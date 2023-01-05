#!/usr/bin/env node

const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "Enter your input>",
});

rl.prompt();

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
  
const { homedir } = require("os");
const store = require("./store/index.js");

module.exports = async function () {
  const { id, tag } = this.user;
  this.storage = await store(`${homedir()}/.lenabot/`);
  console.log(`<@${id}>`, `"${tag}"`, "READY", `/`);
};

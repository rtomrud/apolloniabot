const { version: v } = require("../../package.json");

const version = async function (message) {
  return message.reply({ embed: { title: "Version", v } });
};

module.exports = Object.assign(version, { aliases: ["--version"], safe: true });

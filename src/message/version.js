const { version: v } = require("../../package.json");

const version = async function (message) {
  return message.channel.send({ embed: { title: "Version", v } });
};

module.exports = Object.assign(version, { aliases: ["--version"], safe: true });

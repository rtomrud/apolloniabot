const { version: v } = require("../../package.json");

const version = function (message) {
  message.channel.send({ embed: { description: `lena ${v}` } });
};

module.exports = Object.assign(version, { aliases: ["--version"], safe: true });

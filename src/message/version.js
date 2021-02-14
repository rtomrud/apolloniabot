const { version } = require("../../package.json");

module.exports = function (message) {
  message.channel.send({ embed: { description: `lena ${version}` } });
};

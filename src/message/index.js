const aliases = require("./aliases.js");

const prefixRegExp = RegExp(`^(?:lena|<@!?${process.env.CLIENT_ID}>)`, "i");
const separatorRegExp = /\s+/;

const handleDefault = function (message) {
  message.channel.send({
    embed: { description: "I don't know what you want, try `lena help`" },
  });
};

module.exports = function (message) {
  if (!prefixRegExp.test(message.content)) {
    return;
  }

  message.channel.startTyping();
  const argv = message.content.split(separatorRegExp);
  const command = argv.length > 1 ? argv[1] : "";
  const handle = aliases[command.toLowerCase()] || handleDefault;
  message.argv = argv;
  handle.bind(this)(message);
  message.channel.stopTyping();
};

const aliases = require("./aliases.js");

const prefixRegExp = /^lena/i;
const separatorRegExp = /\s+/;

const handleDefault = (message) => {
  message.channel.send({
    embed: { description: "I don't know what you want, try `lena help`" },
  });
};

module.exports = function (message) {
  if (!prefixRegExp.test(message.content)) {
    return;
  }

  const [, command = "", ...args] = message.content.split(separatorRegExp);
  const handle = aliases[command.toLowerCase()] || handleDefault;
  message.command = command;
  message.args = args;
  handle(message, this);
};

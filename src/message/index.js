const aliases = require("./aliases.js");

const prefixRegExp = /^lena/i;
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

  const argv = message.content.split(separatorRegExp);
  const handle = aliases[argv[1].toLowerCase()] || handleDefault;
  message.argv = argv;
  handle.bind(this)(message);
};

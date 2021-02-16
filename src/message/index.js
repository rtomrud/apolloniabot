const alias = require("./alias.js");

const prefixRegExp = RegExp(`^(?:lena|<@!?${process.env.CLIENT_ID}>)`, "i");
const permissions = 0x00004800;
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

  if (!message.channel.permissionsFor(this.user).has(permissions)) {
    message.author.send(
      "I can't do that because I don't have the Send Messages and Embed Links permissions in that channel"
    );
    return;
  }

  const argv = message.content.split(separatorRegExp);
  const handle = alias(argv) || handleDefault;
  handle.bind(this)(message, argv, alias);
};

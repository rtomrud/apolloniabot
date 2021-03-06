const { Permissions } = require("discord.js");
const alias = require("./alias.js");

const prefixRegExp = RegExp(`^(?:lena|<@!?${process.env.CLIENT_ID}>)`, "i");
const {
  FLAGS: { SEND_MESSAGES, EMBED_LINKS, PRIORITY_SPEAKER },
} = Permissions;
const permissions = SEND_MESSAGES + EMBED_LINKS;
const separatorRegExp = /\s+/;

const isAuthorized = (message, { safe }, player) => {
  const queue = player.getQueue(message);
  const { permissions } = message.member;
  return !queue || !queue.dj || safe || permissions.has(PRIORITY_SPEAKER);
};

const handleDefault = async function (message) {
  return message.channel.send({
    embed: {
      title: "Error",
      description: "I don't know what you want, try `lena help`",
    },
  });
};

module.exports = async function (message) {
  if (!prefixRegExp.test(message.content)) {
    return null;
  }

  const { author, channel, content } = message;
  const argv = content.split(separatorRegExp);
  const handle = alias(argv) || handleDefault;
  const response = await (!channel.permissionsFor(this.user).has(permissions)
    ? author.send(
        "Error: I can't do that because I don't have the Send Messages and Embed Links permissions in that channel"
      )
    : !isAuthorized(message, handle, this.player)
    ? channel.send({
        title: "Error",
        description:
          "You can't do that because **DJ** mode is on and you don't have the Priority Speaker permission",
      })
    : handle.bind(this)(message, argv, alias));
  return response ? [message, response] : [message];
};

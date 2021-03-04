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

const handleDefault = function (message) {
  message.channel.send({
    embed: {
      title: "Error",
      description: "I don't know what you want, try `lena help`",
    },
  });
};

module.exports = function (message) {
  if (!prefixRegExp.test(message.content)) {
    return;
  }

  const { attachments, author, channel, content, guild, id } = message;
  console.log(
    `<@${author.id}>`,
    `"${author.tag}"`,
    "MESSAGE_CREATE",
    `/channels/${guild.id}/${channel.id}/${id}`,
    `"${content}${
      attachments.size > 0 ? ` <${attachments.values().next().value.url}>` : ""
    }"`
  );
  if (!channel.permissionsFor(this.user).has(permissions)) {
    author.send(
      "Error: I can't do that because I don't have the Send Messages and Embed Links permissions in that channel"
    );
    return;
  }

  const argv = content.split(separatorRegExp);
  const handle = alias(argv) || handleDefault;
  if (!isAuthorized(message, handle, this.player)) {
    message.channel.send(
      "Error: I can't do that because **DJ** mode is on and you don't have the Priority Speaker permission"
    );
    return;
  }

  handle.bind(this)(message, argv, alias);
};

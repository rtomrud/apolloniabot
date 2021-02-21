const { Permissions } = require("discord.js");
const alias = require("./alias.js");

const prefixRegExp = RegExp(`^(?:lena|<@!?${process.env.CLIENT_ID}>)`, "i");
const {
  FLAGS: { SEND_MESSAGES, EMBED_LINKS },
} = Permissions;
const permissions = SEND_MESSAGES + EMBED_LINKS;
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
      "I can't do that because I don't have the Send Messages and Embed Links permissions in that channel"
    );
    return;
  }

  const argv = content.split(separatorRegExp);
  const handle = alias(argv) || handleDefault;
  handle.bind(this)(message, argv, alias);
};

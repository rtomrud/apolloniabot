const { Permissions } = require("discord.js");

const {
  FLAGS: { SEND_MESSAGES, EMBED_LINKS },
} = Permissions;
const permissions = SEND_MESSAGES + EMBED_LINKS;

module.exports = async function ({ id, name }) {
  const channel = await this.channels
    .fetch(process.env.CHANNEL_ID)
    .catch(() => null);
  return channel && channel.permissionsFor(this.user).has(permissions)
    ? channel.send({
        embed: {
          title: "Left",
          description: `[${name}](https://discord.com/${id})`,
        },
      })
    : null;
};

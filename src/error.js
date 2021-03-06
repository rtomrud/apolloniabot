const { Permissions } = require("discord.js");

const {
  FLAGS: { SEND_MESSAGES, EMBED_LINKS },
} = Permissions;
const permissions = SEND_MESSAGES + EMBED_LINKS;

module.exports = async function ({ name, message }) {
  const channel = await this.channels.fetch(process.env.CHANNEL_ID);
  return channel.permissionsFor(this.user).has(permissions)
    ? channel.send({
        embed: { title: "Error", description: `${name}: ${message}` },
      })
    : null;
};

const { Permissions } = require("discord.js");
const { version } = require("../package.json");

const {
  FLAGS: { SEND_MESSAGES, EMBED_LINKS },
} = Permissions;
const permissions = SEND_MESSAGES + EMBED_LINKS;

module.exports = async function () {
  const channel = await this.channels.fetch(process.env.CHANNEL_ID);
  return channel.permissionsFor(this.user).has(permissions)
    ? channel.send({ embed: { title: "Ready", description: `v${version}` } })
    : null;
};

const { Permissions } = require("discord.js");
const who = require("./message/who.js");

const {
  FLAGS: { SEND_MESSAGES, EMBED_LINKS },
} = Permissions;
const permissions = SEND_MESSAGES + EMBED_LINKS;

module.exports = async function ({ available, id, name, systemChannel }) {
  if (available && systemChannel) {
    who({ channel: systemChannel });
  }

  const channel = await this.channels.fetch(process.env.CHANNEL_ID);
  return channel.permissionsFor(this.user).has(permissions)
    ? channel.send({
        embed: {
          title: "Joined",
          description: `[${name}](https://discord.com/channels/${id})`,
        },
      })
    : null;
};

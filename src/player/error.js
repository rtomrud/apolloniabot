const { Permissions } = require("discord.js");

const {
  FLAGS: { SEND_MESSAGES, EMBED_LINKS },
} = Permissions;
const permissions = SEND_MESSAGES + EMBED_LINKS;

module.exports = async function (message, error) {
  const { message: err } = error;
  if (err.endsWith("User is not in the voice channel.")) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "I can't join you because you're not in a voice channel",
      },
    });
  }

  if (err.endsWith("You do not have permission to join this voice channel.")) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "I don't have permission to join your voice channel",
      },
    });
  }

  if (err.endsWith("No result!")) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "I can't find anything, check your URL or query",
      },
    });
  }

  if (err.includes("[youtube-dl] ERROR") || err.includes("youtube-dl: error")) {
    return message.channel.send({
      embed: { title: "Error", description: "I can't play that URL" },
    });
  }

  const response = message.channel.send({
    embed: { title: "Error", description: "I can't do that, sorry" },
  });
  const channel = await this.client.channels.fetch(process.env.CHANNEL_ID);
  return channel.permissionsFor(this.client.user).has(permissions)
    ? Promise.all([
        response,
        channel.send({
          embed: { title: "Error", description: `${err.name}: ${err.message}` },
        }),
      ])
    : response;
};

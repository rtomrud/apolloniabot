const { CommandInteraction } = require("discord.js");
const { DisTube } = require("distube");

exports.data = {
  name: "play",
  description: "Play a track or playlist",
  options: [
    {
      name: "query",
      description:
        "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube",
      type: "STRING",
      required: true,
    },
  ],
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const query = interaction.options.get("query").value;
  const channel = await distube.client.channels.fetch(interaction.channelId);
  distube
    .playVoiceChannel(interaction.member.voice.channel, query, {
      member: interaction.member,
      textChannel: channel,
    })
    .catch((error) => distube.emit("error", channel, error));
  return interaction.reply({
    embeds: [{ description: `Searching: ${query}` }],
  });
};

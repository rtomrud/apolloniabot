const { Interaction } = require("discord.js");
const { default: DisTube } = require("distube");

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
  interaction = new Interaction(),
  distube = new DisTube()
) {
  const { channelID, member } = interaction;
  const voiceChannel = member.voice.channel;
  if (!voiceChannel) {
    return interaction.reply({
      embeds: [
        {
          title: "Error",
          description: "I can't join you because you're not in a voice channel",
        },
      ],
    });
  }

  const query = interaction.options.get("query").value;
  const textChannel = await distube.client.channels.fetch(channelID);
  distube.playVoiceChannel(voiceChannel, query, { member, textChannel });
  return interaction.reply({
    embeds: [{ title: "Searching", description: query }],
  });
};

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
    {
      name: "skip",
      description:
        "Whether to skip the current track (if any) and play it immediately (instead of queueing it up)",
      type: "BOOLEAN",
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
  const skip = interaction.options.has("skip")
    ? interaction.options.get("skip").value
    : false;
  const textChannel = await distube.client.channels.fetch(channelID);
  distube.playVoiceChannel(voiceChannel, query, { skip, member, textChannel });
  return interaction.reply({
    embeds: [{ title: "Searching", description: query }],
  });
};

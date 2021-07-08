const { CommandInteraction } = require("discord.js");
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
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  if (!interaction.member.voice.channel) {
    return interaction.reply({
      embeds: [
        {
          description:
            "Error: I can't join you because you're not in a voice channel",
        },
      ],
    });
  }

  const query = interaction.options.get("query").value;
  const skip = interaction.options.get("skip")?.value;
  distube.playVoiceChannel(interaction.member.voice.channel, query, {
    skip,
    member: interaction.member,
    textChannel: await distube.client.channels.fetch(interaction.channelId),
  });
  return interaction.reply({
    embeds: [{ description: `Searching "${query}"` }],
  });
};

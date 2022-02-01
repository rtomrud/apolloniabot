import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "play",
  description: "Play a track or playlist",
  options: [
    {
      name: "query",
      description:
        "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube",
      type: 3,
      required: true,
    },
  ],
};

const isHttpUrl = (string) => {
  try {
    return new URL(string).protocol.startsWith("http");
  } catch {
    return false;
  }
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const query = interaction.options.get("query").value;
  const channel = await player.client.channels.fetch(interaction.channelId);
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

  channel.interaction = interaction;
  player.play(interaction.member.voice.channel, query, {
    member: interaction.member,
    textChannel: channel,
    metadata: { interaction },
  });
  const terms = query.split(" ");
  return interaction.reply({
    embeds: [
      {
        description: `Searching "${
          isHttpUrl(terms[0])
            ? terms[0]
            : `[${query}](https://www.youtube.com/results?search_query=${encodeURIComponent(
                query
              )})`
        }"`,
      },
    ],
  });
};

import {
  Colors,
  CommandInteraction,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "../../node_modules/distube/dist/index.js";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a track or playlist")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription(
        "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube"
      )
      .setRequired(true)
  );

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
  const query = interaction.options.getString("query");
  if (!interaction.member.voice.channel) {
    return interaction.reply({
      embeds: [
        {
          description:
            "Error: I can't join you because you're not in a voice channel",
          color: Colors.Red,
        },
      ],
    });
  }

  const [url] = query.split(" ");
  const searchUrl = isHttpUrl(url)
    ? url
    : hyperlink(
        query,
        `https://www.youtube.com/results?${new URLSearchParams({
          search_query: query,
        })}`
      );
  interaction.interactionResponse = interaction.reply({
    embeds: [{ description: `Searching "${searchUrl}"` }],
  });
  await player.play(interaction.member.voice.channel, query, {
    member: interaction.member,
    textChannel: interaction.channel,
    metadata: { interaction, source: "yt-dlp" },
  });
  return interaction.interactionResponse;
};

import { SlashCommandBuilder, hyperlink } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

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

  const [url] = query.split(" ");
  const searchUrl = isHttpUrl(url)
    ? url
    : hyperlink(
        query,
        `https://www.youtube.com/results?${new URLSearchParams({
          search_query: query,
        })}`
      );
  const reply = interaction.reply({
    embeds: [{ description: `Searching "${searchUrl}"` }],
  });
  channel.interaction = interaction;
  await player.play(interaction.member.voice.channel, query, {
    member: interaction.member,
    textChannel: interaction.channel,
    metadata: { interaction, source: "yt-dlp" },
  });
  return reply;
};

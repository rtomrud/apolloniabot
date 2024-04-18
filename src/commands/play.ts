import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  GuildMember,
  GuildTextBasedChannel,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a track or playlist")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription(
        "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube",
      )
      .setRequired(true),
  )
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player,
) {
  const query = interaction.options.getString("query", true);
  const member = interaction.member as GuildMember;
  if (!member.voice.channel) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription(
            "Error: I can't join you because you're not in a voice channel",
          )
          .setColor(Colors.Red),
      ],
    });
  }

  const [url] = query.split(" ");
  const searchUrl =
    URL.canParse(url) && url.startsWith("http")
      ? url
      : hyperlink(
          query,
          `https://www.youtube.com/results?${String(
            new URLSearchParams({ search_query: query }),
          )}`,
        );
  const interactionResponse = interaction
    .reply({
      embeds: [new EmbedBuilder().setDescription(`Searching "${searchUrl}"`)],
    })
    .catch(() => null);
  await player.play(member.voice.channel, query, {
    member,
    textChannel: interaction.channel as GuildTextBasedChannel,
    metadata: { interactionResponse },
  });
  return interactionResponse;
};

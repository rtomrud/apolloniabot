import ytsr from "@distube/ytsr";
import {
  AutocompleteInteraction,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a track or playlist")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription(
        "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube",
      )
      .setAutocomplete(true)
      .setRequired(true),
  )
  .setDMPermission(false);

export const autocomplete = async function (
  interaction: AutocompleteInteraction,
) {
  const query = interaction.options.getFocused();
  if (query.length === 0) {
    return interaction.respond([]);
  }

  const { items } = await ytsr(query, { type: "video", limit: 10 });
  return interaction.respond(
    items.map(({ name, url }) => ({ name, value: url })),
  );
};

export const handler = async function (
  interaction: ChatInputCommandInteraction,
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

  // @ts-expect-error Wrong typings in lib
  await player.play(member.voice.channel, query, {
    member,
    textChannel: interaction.channel,
    metadata: interactionResponse,
  });
  return interactionResponse;
};

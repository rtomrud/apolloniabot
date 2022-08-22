import {
  ChatInputCommandInteraction,
  Colors,
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
        "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube"
      )
      .setRequired(true)
  );

const isHttpUrl = (string: string) => {
  try {
    return new URL(string).protocol.startsWith("http");
  } catch {
    return false;
  }
};

const resultsUrl = (search_query: string) =>
  `https://www.youtube.com/results?${new URLSearchParams({
    search_query,
  }).toString()}`;

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player
) {
  const query = interaction.options.getString("query") || "";
  const member = interaction.member as GuildMember;
  if (!member.voice.channel) {
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
  const searchUrl = isHttpUrl(url) ? url : hyperlink(query, resultsUrl(query));
  const interactionResponse = interaction
    .reply({ embeds: [{ description: `Searching "${searchUrl}"` }] })
    .catch(() => null);
  await player.play(member.voice.channel, query, {
    member,
    textChannel: interaction.channel as GuildTextBasedChannel,
    metadata: { interaction, interactionResponse },
  });
  return interactionResponse;
};

import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("now")
  .setDescription("Show what's playing now")
  .setDMPermission(false);

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing is playing")
          .setColor(Colors.Red),
      ],
    });
  }

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle(queue.songs[0].name || null)
        .setURL(queue.songs[0].url || "")
        .addFields(
          {
            name: "Duration",
            value: `${queue.formattedCurrentTime}/${
              queue.songs[0].formattedDuration || "--:--"
            }`,
            inline: true,
          },
          {
            name: "Bitrate",
            value: queue.voiceChannel
              ? `${queue.voiceChannel.bitrate / 1000}kbps`
              : "?",
            inline: true,
          },
          {
            name: "Requester",
            value: String(queue.songs[0].user || "Unknown"),
            inline: true,
          },
        ),
    ],
  });
};

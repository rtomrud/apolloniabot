import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  hyperlink,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("now")
  .setDescription("Show what's playing now")
  .setContexts(InteractionContextType.Guild);

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Nothing is playing")
          .setColor(Colors.Red),
      ],
    });
  }

  return interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("Now playing")
        .setDescription(
          hyperlink(
            queue.songs[0].name || queue.songs[0].url || "",
            queue.songs[0].url || "",
          ),
        )
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

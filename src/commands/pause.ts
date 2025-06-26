import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the playback")
  .setDMPermission(false);

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue || queue.paused || queue.stopped) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing to pause")
          .setColor(Colors.Red),
      ],
    });
  }

  await queue.pause();
  return interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        `Paused ${hyperlink(
          queue.songs[0].name || queue.songs[0].url || "",
          queue.songs[0].url || "",
        )} at ${queue.formattedCurrentTime}`,
      ),
    ],
  });
};

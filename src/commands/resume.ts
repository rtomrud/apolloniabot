import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the playback")
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue || !queue.paused) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing to resume")
          .setColor(Colors.Red),
      ],
    });
  }

  queue.resume();

  // Workaround for resume() not working
  queue.pause();
  queue.resume();
  return interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        `Resumed ${hyperlink(
          queue.songs[0].name || queue.songs[0].url || "",
          queue.songs[0].url || "",
        )} at ${queue.formattedCurrentTime}`,
      ),
    ],
  });
};

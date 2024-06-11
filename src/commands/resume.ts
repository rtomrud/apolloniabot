import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the playback")
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player,
) {
  const queue = player.queues.get(interaction);
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

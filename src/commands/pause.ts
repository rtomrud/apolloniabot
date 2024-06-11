import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the playback")
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player,
) {
  const queue = player.queues.get(interaction);
  if (!queue || queue.paused || queue.stopped) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing to pause")
          .setColor(Colors.Red),
      ],
    });
  }

  queue.pause();
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

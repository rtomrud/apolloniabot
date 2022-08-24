import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription(
    "Stop the playback, clear the queue and leave the voice channel"
  )
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player
) {
  const queue = player.queues.get(interaction);
  if (!queue) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing to stop")
          .setColor(Colors.Red),
      ],
    });
  }

  await queue.stop();
  return interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        queue.playing
          ? `Stopped ${hyperlink(
              queue.songs[0].name || queue.songs[0].url,
              queue.songs[0].url
            )} at ${queue.formattedCurrentTime}`
          : "Stopped"
      ),
    ],
  });
};

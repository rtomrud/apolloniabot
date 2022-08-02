import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the playback");

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player
) {
  const queue = player.queues.get(interaction);
  if (!queue || queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to resume", color: Colors.Red }],
    });
  }

  queue.resume();
  return interaction.reply({
    embeds: [
      {
        description: `Resumed ${hyperlink(
          queue.songs[0].name || queue.songs[0].url,
          queue.songs[0].url
        )} at ${queue.formattedCurrentTime}`,
      },
    ],
  });
};

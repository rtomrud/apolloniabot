import {
  Colors,
  CommandInteraction,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("pause")
  .setDescription("Pause the playback");

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to pause", color: Colors.Red }],
    });
  }

  queue.pause();
  return interaction.reply({
    embeds: [
      {
        description: `Paused ${hyperlink(
          queue.songs[0].name,
          queue.songs[0].url
        )} at ${queue.formattedCurrentTime}`,
      },
    ],
  });
};

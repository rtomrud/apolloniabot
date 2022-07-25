import {
  Colors,
  CommandInteraction,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription(
    "Stop the playback, clear the queue and leave the voice channel"
  );

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to stop", color: Colors.Red }],
    });
  }

  queue.stop();
  return interaction.reply({
    embeds: [
      {
        description: queue.playing
          ? `Stopped ${hyperlink(queue.songs[0].name, queue.songs[0].url)} at ${
              queue.formattedCurrentTime
            }`
          : "Stopped",
      },
    ],
  });
};

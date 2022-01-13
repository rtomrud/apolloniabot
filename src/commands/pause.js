import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "pause",
  description: "Pause the playback",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to pause" }],
    });
  }

  queue.pause();
  return interaction.reply({
    embeds: [
      {
        description: `Paused [${queue.songs[0].name}](${queue.songs[0].url}) at ${queue.formattedCurrentTime}`,
      },
    ],
  });
};

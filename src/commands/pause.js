import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";
import formatPlayback from "../format-playback.js";

export const data = {
  name: "pause",
  description: "Pause the playback",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to pause" }],
    });
  }

  queue.pause();
  return interaction.reply({
    embeds: [{ description: `Paused ${formatPlayback(queue)}` }],
  });
};

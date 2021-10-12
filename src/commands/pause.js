import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";
import formatPlayback from "../formatters/format-playback.js";

export const data = {
  name: "pause",
  description: "Pause the playback",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new DisTube()
) {
  const queue = player.queues.get(interaction.guildId);
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

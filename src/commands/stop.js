import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";
import formatPlayback from "../format-playback.js";

export const data = {
  name: "stop",
  description: "Stop the playback, clear the queue and leave the voice channel",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to stop" }],
    });
  }

  const playback = queue.playing ? formatPlayback(queue) : "";
  queue.stop();
  return interaction.reply({
    embeds: [{ description: `Stopped ${playback}` }],
  });
};

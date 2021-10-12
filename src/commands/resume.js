import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";
import formatPlayback from "../formatters/format-playback.js";

export const data = {
  name: "resume",
  description: "Resume the playback",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to resume" }],
    });
  }

  queue.resume();
  return interaction.reply({
    embeds: [{ description: `Resumed ${formatPlayback(queue)}` }],
  });
};

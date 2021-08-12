import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";

export const data = {
  name: "shuffle",
  description: "Shuffle the queue",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue || queue.songs.length <= 1) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to shuffle" }],
    });
  }

  queue.shuffle();
  return interaction.reply({ embeds: [{ description: "Shuffled the queue" }] });
};

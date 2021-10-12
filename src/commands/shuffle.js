import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "shuffle",
  description: "Shuffle the queue",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || queue.songs.length <= 1) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to shuffle" }],
    });
  }

  queue.shuffle();
  return interaction.reply({ embeds: [{ description: "Shuffled the queue" }] });
};

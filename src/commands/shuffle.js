const { CommandInteraction } = require("discord.js");
const { DisTube } = require("distube");

exports.data = {
  name: "shuffle",
  description: "Shuffle the queue",
};

exports.handler = async function (
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

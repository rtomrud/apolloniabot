const { Interaction } = require("discord.js");
const { default: DisTube } = require("distube");

exports.data = {
  name: "shuffle",
  description: "Shuffle the queue",
};

exports.handler = async function (
  interaction = new Interaction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue || queue.songs.length <= 1) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to shuffle" }],
    });
  }

  queue.shuffle();
  return interaction.reply({ embeds: [{ title: "Shuffled the queue" }] });
};

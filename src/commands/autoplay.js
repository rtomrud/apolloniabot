const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");

exports.data = {
  name: "autoplay",
  description: "Toggle whether a related track is played when the queue ends",
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to autoplay" }],
    });
  }

  const autoplay = queue.toggleAutoplay();
  return interaction.reply({
    embeds: [{ title: "Autoplay", description: autoplay ? "on" : "off" }],
  });
};

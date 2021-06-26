const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");

exports.data = {
  name: "pause",
  description: "Pause the playback",
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to pause" }],
    });
  }

  queue.pause();
  return interaction.reply({
    embeds: [{ title: "Paused", description: formatPlayback(queue) }],
  });
};

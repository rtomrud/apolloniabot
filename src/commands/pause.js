const { CommandInteraction } = require("discord.js");
const { DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");

exports.data = {
  name: "pause",
  description: "Pause the playback",
};

exports.handler = async function (
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

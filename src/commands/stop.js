const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");

exports.data = {
  name: "stop",
  description: "Stop the playback, clear the queue and leave the voice channel",
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to stop" }],
    });
  }

  const description = queue.playing ? formatPlayback(queue) : "";
  queue.stop();
  return interaction.reply({ embeds: [{ title: "Stopped", description }] });
};

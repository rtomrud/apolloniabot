const { Interaction } = require("discord.js");
const { default: DisTube } = require("distube");
const formatPlayback = require("../format-playback.js");

exports.data = {
  name: "resume",
  description: "Resume the playback",
};

exports.handler = async function (
  interaction = new Interaction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue || queue.playing) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to resume" }],
    });
  }

  queue.resume();
  return interaction.reply({
    embeds: [{ title: "Resumed", description: formatPlayback(queue) }],
  });
};

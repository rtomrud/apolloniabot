const { Interaction } = require("discord.js");
const { default: DisTube } = require("distube");
const formatSong = require("../format-song.js");

exports.data = {
  name: "next",
  description: "Play the next track in the queue",
};

exports.handler = async function (
  interaction = new Interaction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue || (queue.songs.length <= 1 && !queue.autoplay)) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to skip" }],
    });
  }

  const [previousSong] = queue.songs;
  queue.skip();
  return interaction.reply({
    embeds: [{ title: "Skipped", description: formatSong(previousSong) }],
  });
};

const formatSong = require("../format-song.js");

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({ embed: { description: "Nothing to stop" } });
    return;
  }

  this.player.stop(message);
  message.channel.send({
    embed: { description: `Stopped ${formatSong(queue.songs[0])}` },
  });
};

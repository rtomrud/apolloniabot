const formatSong = require("../format-song.js");

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({ embed: { description: "Nothing to pause" } });
    return;
  }

  this.player.pause(message);
  message.channel.send({
    embed: { description: `Paused ${formatSong(queue.songs[0])}` },
  });
};

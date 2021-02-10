const formatSong = require("../format-song.js");

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.playing) {
    message.channel.send({ embed: { description: "Nothing to resume" } });
    return;
  }

  this.player.resume(message);
  message.channel.send({
    embed: { description: `Resumed ${formatSong(queue.songs[0])}` },
  });
};

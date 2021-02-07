const formatSong = require("../format-song.js");

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.songs.length < 2) {
    message.channel.send({
      embed: { description: "Nothing waiting in queue" },
    });
    return;
  }

  const { songs } = queue;
  const song = songs[songs.length - 1];
  queue.songs = [songs[0], song, ...songs.slice(1, -1)];
  message.channel.send({
    embed: { description: `Next up ${formatSong(song)}` },
  });
};

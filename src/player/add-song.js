const formatSong = require("../format-song.js");

module.exports = function (message, queue, song) {
  message.channel.send({
    embed: { description: `Queued ${formatSong(song)}` },
  });
};

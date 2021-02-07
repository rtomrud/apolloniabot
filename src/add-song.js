const formatSong = require("./format-song.js");

module.exports = function (message, { songs: { length } }, song) {
  message.channel.send({
    embed: {
      description: `Queued ${formatSong(song)}
(${length} tracks in queue)`,
    },
  });
};

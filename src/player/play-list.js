const formatPlaylist = require("../format-playlist.js");
const formatSong = require("../format-song.js");

module.exports = function (message, queue, playlist, song) {
  message.channel.send({
    embed: {
      description: `Queued ${formatPlaylist(playlist)}
Playing ${formatSong(song)}`,
    },
  });
};

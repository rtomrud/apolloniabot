const formatPlaylist = require("../format-playlist.js");
const formatSong = require("../format-song.js");

module.exports = function (message, queue, playlist, song) {
  message.channel.send({
    embed: { title: "Queued", description: formatPlaylist(playlist) },
  });
  message.channel.send({
    embed: { title: "Playing", description: formatSong(song) },
  });
};

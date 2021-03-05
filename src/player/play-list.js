const formatPlaylist = require("../format-playlist.js");

module.exports = function (message, queue, playlist) {
  message.channel.send({
    embed: { title: "Playing", description: formatPlaylist(playlist) },
  });
};

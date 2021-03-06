const formatPlaylist = require("../format-playlist.js");

module.exports = async function (message, queue, playlist) {
  return message.channel.send({
    embed: { title: "Playing", description: formatPlaylist(playlist) },
  });
};

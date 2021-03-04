const formatSong = require("../format-song.js");

module.exports = function (message, queue, song) {
  message.channel.send({
    embed: {
      title: this.client.user === song.user ? "Autoplaying" : "Playing",
      description: formatSong(song),
    },
  });
};

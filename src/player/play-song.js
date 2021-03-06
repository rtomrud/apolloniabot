const formatSong = require("../format-song.js");

module.exports = async function (message, queue, song) {
  return message.channel.send({
    embed: {
      title: this.client.user === song.user ? "Autoplaying" : "Playing",
      description: formatSong(song),
    },
  });
};

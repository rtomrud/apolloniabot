const formatSong = require("../format-song.js");

module.exports = function (message, queue, song) {
  message.channel.send({
    embed: {
      title: "Playing",
      description: formatSong(song),
      footer: { text: this.client.user === song.user ? "autoplay on" : "" },
    },
  });
};

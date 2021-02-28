const formatSong = require("../format-song.js");

module.exports = function (message, queue, song) {
  const verb = this.client.user !== song.user ? "Playing" : "Autoplaying";
  message.channel.send({
    embed: { description: `${verb} ${formatSong(song)}` },
  });
};

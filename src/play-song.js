const formatSong = require("./format-song.js");

module.exports = function (message, queue, song) {
  message.channel.send({
    embed: { description: `Playing ${formatSong(song)}` },
  });
};

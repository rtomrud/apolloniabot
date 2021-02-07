const formatSong = require("./format-song.js");

module.exports = function (message, queue, { songs: { length } }, song) {
  message.channel.send({
    embed: {
      description: `Playing ${formatSong(song)}${
        length > 1 ? `\nQueued ${length} track${length === 1 ? "" : "s"}` : ""
      }`,
    },
  });
};

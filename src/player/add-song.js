const formatSong = require("../format-song.js");

module.exports = async function (message, queue, song) {
  return message.channel.send({
    embed: { title: "Queued", description: formatSong(song) },
  });
};

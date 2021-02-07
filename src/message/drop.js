const formatSong = require("../format-song.js");

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to drop" } });
    return;
  }

  const arg = Number(message.argv.slice(2).find((arg) => /^-?\d+/.test(arg)));
  const { songs } = queue;
  const { length } = songs;
  if (arg < 1 || arg > length) {
    message.channel.send({
      embed: {
        description: "I can't drop that track because it doesn't exist",
      },
    });
    return;
  }

  const index = (arg || length) - 1;
  if (index === 0 && queue.playing) {
    message.channel.send({
      embed: { description: "I can't drop track 1 because it's playing now" },
    });
    return;
  }

  queue.songs = queue.songs.filter((song, i) => i !== index);
  message.channel.send({
    embed: {
      description: `Dropped track ${index + 1}: ${formatSong(songs[index])}`,
    },
  });
};

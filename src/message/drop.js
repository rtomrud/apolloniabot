const formatSong = require("../format-song.js");

const integerRegExp = /^-?\d+/;

module.exports = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to drop" } });
    return;
  }

  const arg = argv.slice(2).find((arg) => integerRegExp.test(arg));
  const integer = Number(arg);
  const { songs } = queue;
  const { length } = songs;
  if (integer < 1 || integer > length) {
    message.channel.send({
      embed: {
        description: "I can't drop that track because it doesn't exist",
      },
    });
    return;
  }

  const index = (integer || length) - 1;
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

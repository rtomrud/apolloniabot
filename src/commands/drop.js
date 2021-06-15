const formatSong = require("../format-song.js");

const integerRegExp = /^-?\d+/;

const drop = async function (player, message, argv) {
  const queue = player.getQueue(message);
  if (!queue) {
    return message.reply({
      embed: { title: "Error", description: "Nothing to drop" },
    });
  }

  const { length } = queue.songs;
  const [arg] = argv
    .slice(2)
    .filter((arg) => integerRegExp.test(arg))
    .map((arg) => Number(arg));
  const start = (arg != null ? arg : length) - 1;
  if (start < 0 || start >= length) {
    return message.reply({
      embed: {
        title: "Error",
        description: "Nothing to drop at that position",
      },
    });
  }

  if (start === 0 && queue.playing) {
    return message.reply({
      embed: {
        title: "Error",
        description: "I can't drop track 1 because it's playing now",
      },
    });
  }

  const [song] = queue.songs.splice(start, 1);
  return message.reply({
    embed: {
      title: "Dropped track",
      fields: [{ name: start + 1, value: formatSong(song) }],
    },
  });
};

module.exports = Object.assign(drop, {
  aliases: ["d", "delete", "remove", "rm"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "lena drop - Drop a track from the queue",
        },
        {
          name: "SYNOPSIS",
          value: "**lena drop** [POSITION]\nalias: d",
        },
        {
          name: "DESCRIPTION",
          value:
            "Deletes the track at POSITION from the queue. Defaults to the position of the last track.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena drop\`
\`lena drop 2\`
\`lena d\`
`,
        },
        {
          name: "SEE ALSO",
          value: `
\`lena help queue\`
`,
        },
      ],
    },
  },
});

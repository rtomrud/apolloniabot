const formatSong = require("../format-song.js");

const integerRegExp = /^-?\d+/;
const pageSize = 10;

const drop = async function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    return message.channel.send({
      embed: { title: "Error", description: "Nothing to drop" },
    });
  }

  const { length } = queue.songs;
  const [arg1, arg2] = argv
    .slice(2)
    .filter((arg) => integerRegExp.test(arg))
    .map((arg) => Number(arg));
  const start = (arg1 != null ? arg1 : length) - 1;
  const deleteCount = arg2 > arg1 ? arg2 - arg1 + 1 : 1;
  if (start < 0 || start >= length) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "Nothing to drop at that position",
      },
    });
  }

  if (start === 0 && queue.playing) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "I can't drop track 1 because it's playing now",
      },
    });
  }

  const deletes = queue.songs.splice(start, deleteCount);
  return message.channel.send({
    embed: {
      title: "Dropped",
      fields: deletes.slice(0, pageSize).map((song, i) => ({
        name: i + start + 1,
        value: formatSong(song),
      })),
      footer: {
        text:
          deletes.length > pageSize
            ? `And ${deletes.length - pageSize} more`
            : "",
      },
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
          value: "lena drop - Drop tracks from the queue",
        },
        {
          name: "SYNOPSIS",
          value: "**lena drop** [START] [END]\nalias: d",
        },
        {
          name: "DESCRIPTION",
          value:
            "Deletes tracks from the queue, from the START position to the END position (both included). START defaults to the position of the last track. END defaults to START + 1. If START isn't specified, the last track from the queue is deleted. If end isn't specified, only the track specified by START is deleted.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena drop\`
\`lena drop 2\`
\`lena drop 2 4\`
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

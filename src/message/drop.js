const integerRegExp = /^-?\d+/;

const drop = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to drop" } });
    return;
  }

  const { length } = queue.songs;
  const [arg1, arg2] = argv
    .slice(2)
    .filter((arg) => integerRegExp.test(arg))
    .map((arg) => Number(arg));
  const start = (arg1 != null ? arg1 : length) - 1;
  const deleteCount = arg2 > arg1 ? arg2 - arg1 + 1 : 1;
  if (start < 0 || start >= length) {
    message.channel.send({
      embed: { description: "I can't drop that because it's not in the queue" },
    });
    return;
  }

  if (start === 0 && queue.playing) {
    message.channel.send({
      embed: { description: "I can't drop track 1 because it's playing now" },
    });
    return;
  }

  const { length: deletes } = queue.songs.splice(start, deleteCount);
  message.channel.send({
    embed: {
      description: `Dropped track${deletes > 1 ? "s" : ""} ${start + 1}${
        deletes > 1 ? ` to ${start + deletes}` : ""
      }`,
    },
  });
};

module.exports = Object.assign(drop, {
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena drop** - Drop tracks from the queue",
        },
        {
          name: "SYNOPSIS",
          value: "lena drop [START] [END]\nalias: d",
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

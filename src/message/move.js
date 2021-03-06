const integerRegExp = /^-?\d+/;

const move = async function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    return message.channel.send({
      embed: { title: "Error", description: "Nothing to move" },
    });
  }

  const { length } = queue.songs;
  if (length < 2) {
    return message.channel.send({
      embed: { title: "Error", description: "Nowhere to move" },
    });
  }

  const [arg1, arg2] = argv
    .slice(2)
    .filter((arg) => integerRegExp.test(arg))
    .map((arg) => Number(arg));
  const from = (arg1 != null ? arg1 : length) - 1;
  const to = (arg2 != null ? arg2 : 2) - 1;
  if (from < 0 || from >= length) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "I can't move from a position outside the queue",
      },
    });
  }

  if (to < 0 || to >= length) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "I can't move to a position outside the queue",
      },
    });
  }

  if ((from === 0 || to === 0) && queue.playing) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "I can't move track 1 because it's currently playing",
      },
    });
  }

  queue.songs.splice(to, 0, queue.songs.splice(from, 1)[0]);
  return message.channel.send({
    embed: {
      title: "Moved track",
      description: `${from + 1} to position ${to + 1}`,
    },
  });
};

module.exports = Object.assign(move, {
  aliases: ["m"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena move** - Move a track",
        },
        {
          name: "SYNOPSIS",
          value: "lena move [FROM] [TO]\nalias: m",
        },
        {
          name: "DESCRIPTION",
          value:
            "Moves a track FROM the specified position TO the specified position. FROM defaults to the last track of the queue. TO defaults to 2, that is, the track after the current one. If neither FROM nor TO is specified, it moves the last track from the queue to position 2 so that it plays next.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena move\`
\`lena move 4\`
\`lena move 2 4\`
\`lena m\`
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

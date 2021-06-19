const shuffle = async function (player, message) {
  const queue = player.getQueue(message);
  if (!queue || queue.songs.length <= 1) {
    return message.reply({
      embeds: [{ title: "Error", description: "Nothing to shuffle" }],
    });
  }

  queue.shuffle();
  return message.reply({ embeds: [{ title: "Shuffled the queue" }] });
};

module.exports = Object.assign(shuffle, {
  aliases: ["s", "rand", "random", "randomize"],
  usage: {
    embeds: [
      {
        fields: [
          {
            name: "NAME",
            value: "lena shuffle - Shuffle the queue",
          },
          {
            name: "SYNOPSIS",
            value: "**lena shuffle**\nalias: s",
          },
          {
            name: "DESCRIPTION",
            value:
              "Shuffles the queue. If there is a track currently playing, that track isn't shuffled.",
          },
          {
            name: "EXAMPLES",
            value: `
\`lena shuffle\`
\`lena s\`
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
    ],
  },
});

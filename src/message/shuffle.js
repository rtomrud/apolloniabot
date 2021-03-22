const seedrandom = require("seedrandom");

const shuffle = async function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.songs.length <= 1) {
    return message.channel.send({
      embed: { title: "Error", description: "Nothing to shuffle" },
    });
  }

  const { songs } = queue;
  const random = seedrandom(message.id);
  const playing = songs.shift();
  for (let i = songs.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [songs[i], songs[j]] = [songs[j], songs[i]];
  }

  songs.unshift(playing);
  return message.channel.send({ embed: { title: "Shuffled the queue" } });
};

module.exports = Object.assign(shuffle, {
  aliases: ["s", "rand", "random", "randomize"],
  usage: {
    embed: {
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
  },
});

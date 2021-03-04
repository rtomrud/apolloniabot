const next = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || (queue.songs.length <= 1 && !queue.autoplay)) {
    message.channel.send({
      embed: { title: "Error", description: "Nothing to skip" },
    });
    return;
  }

  this.player.skip(message);
};

module.exports = Object.assign(next, {
  aliases: ["n"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena next** - Play the next track",
        },
        {
          name: "SYNOPSIS",
          value: "lena next\nalias: n",
        },
        {
          name: "DESCRIPTION",
          value: "Plays the next track in the queue.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena next\`
\`lena n\`
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

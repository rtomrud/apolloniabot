const formatSong = require("../format-song.js");

const cut = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.songs.length < 2) {
    message.channel.send({
      embed: { description: "Nothing waiting in queue" },
    });
    return;
  }

  const { songs } = queue;
  const song = songs[songs.length - 1];
  queue.songs = [songs[0], song, ...songs.slice(1, -1)];
  message.channel.send({
    embed: { description: `Next up ${formatSong(song)}` },
  });
};

module.exports = Object.assign(cut, {
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena cut** - Cut the queue",
        },
        {
          name: "SYNOPSIS",
          value: "lena cut\nalias: c",
        },
        {
          name: "DESCRIPTION",
          value:
            "Moves the last track of the queue after the current track so that it plays next.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena cut\`
\`lena c\`
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

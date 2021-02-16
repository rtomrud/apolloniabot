const formatSong = require("../format-song.js");

const stop = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({ embed: { description: "Nothing to stop" } });
    return;
  }

  this.player.stop(message);
  message.channel.send({
    embed: { description: `Stopped ${formatSong(queue.songs[0])}` },
  });
};

module.exports = Object.assign(stop, {
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena stop** - Stop the playback",
        },
        {
          name: "SYNOPSIS",
          value: "lena stop",
        },
        {
          name: "DESCRIPTION",
          value:
            "Stops the playback, clears the queue, and leaves the voice channel.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena stop\`
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

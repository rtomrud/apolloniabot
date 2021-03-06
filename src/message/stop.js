const formatSong = require("../format-song.js");

const stop = async function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    return message.channel.send({
      embed: { title: "Error", description: "Nothing to stop" },
    });
  }

  this.player.stop(message);
  return message.channel.send({
    embed: { title: "Stopped", description: formatSong(queue.songs[0]) },
  });
};

module.exports = Object.assign(stop, {
  aliases: ["exit", "clean", "clear", "empty", "leave", "disconnect"],
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

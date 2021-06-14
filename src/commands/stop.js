const formatPlayback = require("../format-playback.js");

const stop = async function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    return message.reply({
      embed: { title: "Error", description: "Nothing to stop" },
    });
  }

  queue.stop();
  return message.reply({
    embed: {
      title: "Stopped",
      description: queue.playing ? formatPlayback(queue) : "",
    },
  });
};

module.exports = Object.assign(stop, {
  aliases: ["exit", "clean", "clear", "empty", "leave", "disconnect"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "lena stop - Stop the playback",
        },
        {
          name: "SYNOPSIS",
          value: "**lena stop**",
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

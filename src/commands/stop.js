const formatPlayback = require("../format-playback.js");

const stop = async function (player, message) {
  const queue = player.getQueue(message);
  if (!queue) {
    return message.reply({
      embeds: [{ title: "Error", description: "Nothing to stop" }],
    });
  }

  const description = queue.playing ? formatPlayback(queue) : "";
  queue.stop();
  return message.reply({ embeds: [{ title: "Stopped", description }] });
};

module.exports = Object.assign(stop, {
  aliases: ["exit", "clean", "clear", "empty", "leave", "disconnect"],
  usage: {
    embeds: [
      {
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
    ],
  },
});

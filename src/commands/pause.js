const formatPlayback = require("../format-playback.js");

const pause = async function (player, message) {
  const queue = player.getQueue(message);
  if (!queue || !queue.playing) {
    return message.reply({
      embeds: [{ title: "Error", description: "Nothing to pause" }],
    });
  }

  queue.pause();
  return message.reply({
    embeds: [{ title: "Paused", description: formatPlayback(queue) }],
  });
};

module.exports = Object.assign(pause, {
  aliases: ["sh", "shh", "shhh", "stfu", "shut"],
  usage: {
    embeds: [
      {
        fields: [
          {
            name: "NAME",
            value: "lena pause - Pause the playback",
          },
          {
            name: "SYNOPSIS",
            value: "**lena pause**\nalias: sh",
          },
          {
            name: "DESCRIPTION",
            value: "Pauses the current track.",
          },
          {
            name: "EXAMPLES",
            value: `
\`lena pause\`
\`lena sh\`
`,
          },
          {
            name: "SEE ALSO",
            value: `
\`lena help resume\`
`,
          },
        ],
      },
    ],
  },
});

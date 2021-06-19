const formatPlayback = require("../format-playback.js");

const resume = async function (player, message) {
  const queue = player.getQueue(message);
  if (!queue || queue.playing) {
    return message.reply({
      embeds: [{ title: "Error", description: "Nothing to resume" }],
    });
  }

  queue.resume();
  return message.reply({
    embeds: [{ title: "Resumed", description: formatPlayback(queue) }],
  });
};

module.exports = Object.assign(resume, {
  aliases: ["r", "unpause"],
  usage: {
    embeds: [
      {
        fields: [
          {
            name: "NAME",
            value: "lena resume - Resume the playback",
          },
          {
            name: "SYNOPSIS",
            value: "**lena resume**\nalias: r",
          },
          {
            name: "DESCRIPTION",
            value: "Resumes the current track.",
          },
          {
            name: "EXAMPLES",
            value: `
\`lena resume\`
\`lena r\`
`,
          },
          {
            name: "SEE ALSO",
            value: `
\`lena help pause\`
`,
          },
        ],
      },
    ],
  },
});

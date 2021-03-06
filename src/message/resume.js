const formatSong = require("../format-song.js");

const resume = async function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.playing) {
    return message.channel.send({
      embed: { title: "Error", description: "Nothing to resume" },
    });
  }

  this.player.resume(message);
  return message.channel.send({
    embed: { title: "Resumed", description: formatSong(queue.songs[0]) },
  });
};

module.exports = Object.assign(resume, {
  aliases: ["r", "unpause"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena resume** - Resume the playback",
        },
        {
          name: "SYNOPSIS",
          value: "lena resume\nalias: r",
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
  },
});

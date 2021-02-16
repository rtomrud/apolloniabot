const formatSong = require("../format-song.js");

const pause = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.playing) {
    message.channel.send({ embed: { description: "Nothing to resume" } });
    return;
  }

  this.player.resume(message);
  message.channel.send({
    embed: { description: `Resumed ${formatSong(queue.songs[0])}` },
  });
};

module.exports = Object.assign(pause, {
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

const formatSong = require("../format-song.js");

const pause = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({
      embed: { title: "Error", description: "Nothing to pause" },
    });
    return;
  }

  this.player.pause(message);
  message.channel.send({
    embed: { title: "Paused", description: formatSong(queue.songs[0]) },
  });
};

module.exports = Object.assign(pause, {
  aliases: ["sh", "shh", "shhh", "stfu", "shut"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena pause** - Pause the playback",
        },
        {
          name: "SYNOPSIS",
          value: "lena pause\nalias: sh",
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
  },
});

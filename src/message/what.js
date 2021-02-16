const formatPlayback = require("../format-playback.js");

const what = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({ embed: { description: "Nothing is playing" } });
    return;
  }

  const { autoplay, filter, repeatMode, volume } = queue;
  message.channel.send({
    embed: {
      description: `Playing ${formatPlayback(queue)}`,
      fields: [
        {
          name: "Volume",
          value: volume,
          inline: true,
        },
        {
          name: "Autoplay",
          value: autoplay ? "on" : "off",
          inline: true,
        },
        {
          name: "Loop",
          value:
            repeatMode === 2 ? "queue" : repeatMode === 1 ? "track" : "off",
          inline: true,
        },
        {
          name: "Effect",
          value: filter || "off",
          inline: true,
        },
      ],
    },
  });
};

module.exports = Object.assign(what, {
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena what** - Show what's playing now",
        },
        {
          name: "SYNOPSIS",
          value: "lena what\nalias: w",
        },
        {
          name: "DESCRIPTION",
          value:
            "Shows the status of the player, that is, what track is playing now, the current time, the duration, the volume, whether autoplay is enabled, whether loop mode is enabled, and what effects are enabled, if any.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena what\`
\`lena w\`
`,
        },
        {
          name: "SEE ALSO",
          value: `
\`lena help pause\`
\`lena help resume\`
\`lena help volume\`
\`lena help autoplay\`
\`lena help effect\`
`,
        },
      ],
    },
  },
});

const formatPlayback = require("../format-playback.js");

const formatStatus = ({ autoplay, filter, repeatMode, volume }) => {
  return `volume: ${volume}%${autoplay ? ", autoplay: on" : ""}${
    repeatMode ? `, loop: ${repeatMode === 2 ? "queue" : "track"}` : ""
  }${filter ? `, effects: ${filter}` : ""}`;
};

const what = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({ embed: { description: "Nothing is playing" } });
    return;
  }

  message.channel.send({
    embed: {
      description: `Playing ${formatPlayback(queue)}\n\n${formatStatus(queue)}`,
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
            "Shows the status of the player, that is, what track is playing now, the current time, the duration, the volume, whether autoplay is enabled, and the effects, if any.",
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

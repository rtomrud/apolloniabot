const formatPlayback = require("../format-playback.js");

const what = async function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    return message.reply({ embed: { description: "Nothing in queue" } });
  }

  const { autoplay, filters, repeatMode: loop, songs, volume } = queue;
  return message.reply({
    embed: {
      title: queue.playing ? "Now playing" : "Now paused",
      description: formatPlayback(queue),
      fields: [
        { name: "Requester", value: songs[0].user, inline: true },
        { name: "Volume", value: `${volume}%`, inline: true },
        { name: "Effects", value: filters.join(", ") || "off", inline: true },
        { name: "Autoplay", value: autoplay ? "on" : "off", inline: true },
        { name: "Loop", value: ["off", "track", "queue"][loop], inline: true },
        { name: "DJ", value: queue.dj ? "on" : "off", inline: true },
      ],
    },
  });
};

module.exports = Object.assign(what, {
  aliases: ["w", "np", "now", "song", "track", "status", "playing"],
  safe: true,
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "lena what - Show what's playing now",
        },
        {
          name: "SYNOPSIS",
          value: "**lena what**\nalias: w",
        },
        {
          name: "DESCRIPTION",
          value:
            "Shows the status of the player, that is, what track is playing now, the current time, the duration, the volume, whether autoplay is enabled, whether loop mode is enabled, what effects are enabled, if any, and whether DJ mode is enabled.",
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
\`lena help autoplay\`
\`lena help dj\`
\`lena help effect\`
\`lena help loop\`
\`lena help pause\`
\`lena help resume\`
\`lena help volume\`
`,
        },
      ],
    },
  },
});

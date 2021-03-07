const formatPlayback = require("../format-playback.js");

const timeRegExp = /^([+-])?(?:(?:(\d{1,2}):)?(\d{1,2}):)?(\d+(?:\.\d{1,3})?)s?/;

const seek = async function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    return message.channel.send({
      embed: { title: "Error", description: "Nothing to seek on" },
    });
  }

  const arg = argv.slice(2).find((arg) => timeRegExp.test(arg));
  if (!arg) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "I don't know to what time you want to seek",
      },
    });
  }

  const [{ duration }] = queue.songs;
  const [, sign = "", h = 0, m = 0, s] = timeRegExp.exec(arg);
  const ms = Number(h) * 3600000 + Number(m) * 60000 + Number(s) * 1000;
  const t =
    sign === "+"
      ? queue.currentTime + ms
      : sign === "-"
      ? queue.currentTime - ms
      : ms;
  this.player.seek(message, Math.max(0, Math.min(t, duration * 1000)));
  return message.channel.send({
    embed: { title: "Playing", description: formatPlayback(queue) },
  });
};

module.exports = Object.assign(seek, {
  aliases: ["t", "jump", "goto"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "lena seek - Seek to a specified time",
        },
        {
          name: "SYNOPSIS",
          value: "**lena seek** TIME\nalias: t",
        },
        {
          name: "DESCRIPTION",
          value:
            "Seeks to the specified TIME in the current song. TIME may be a timestamp in seconds or a time string (hh:mm:ss). If TIME starts with a + character, it seeks forward. If time starts with a - character, it seeks backward.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena seek 60\`
\`lena seek +10\`
\`lena seek -10\`
\`lena t 2:00\`
`,
        },
        {
          name: "SEE ALSO",
          value: `
\`lena help what\`
`,
        },
      ],
    },
  },
});

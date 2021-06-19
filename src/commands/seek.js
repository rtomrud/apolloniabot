const formatPlayback = require("../format-playback.js");

const timeRegExp =
  /^([+-])?(?:(?:(\d{1,2}):)?(\d{1,2}):)?(\d+(?:\.\d{1,3})?)s?/;

const seek = async function (player, message, argv) {
  const queue = player.getQueue(message);
  if (!queue || !queue.playing) {
    return message.reply({
      embeds: [{ title: "Error", description: "Nothing to seek on" }],
    });
  }

  const arg = argv.slice(2).find((arg) => timeRegExp.test(arg));
  if (!arg) {
    return message.reply({
      embeds: [
        {
          title: "Error",
          description: "I don't know to what time you want to seek",
        },
      ],
    });
  }

  const { currentTime, songs } = queue;
  const [, sign = "", h = 0, m = 0, s] = timeRegExp.exec(arg);
  const t = Number(h) * 3600 + Number(m) * 60 + Number(s);
  const time =
    sign === "+" ? currentTime + t : sign === "-" ? currentTime - t : t;
  queue.seek(Math.max(0, Math.min(time, songs[0].duration)));
  return message.reply({
    embeds: [{ title: "Seeked", description: formatPlayback(queue) }],
  });
};

module.exports = Object.assign(seek, {
  aliases: ["t", "jump", "goto"],
  usage: {
    embeds: [
      {
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
    ],
  },
});

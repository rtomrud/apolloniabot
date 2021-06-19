const formatPlayback = require("../format-playback.js");
const formatSong = require("../format-song.js");

const pageSize = 10;
const integerRegExp = /^-?\d+/;

const queue = async function (player, message, argv) {
  const queue = player.getQueue(message);
  if (!queue) {
    return message.reply({
      embeds: [{ title: "Error", description: "Nothing in queue" }],
    });
  }

  const { formattedDuration, songs } = queue;
  const { length } = songs;
  const [first] = songs;
  const arg = Number(argv.slice(2).find((arg) => integerRegExp.test(arg)));
  const pages = Math.ceil(length / pageSize);
  const page = arg * pageSize > length ? pages : arg <= 0 || !arg ? 1 : arg;
  const start = (page - 1) * pageSize;
  const end = page * pageSize < length ? page * pageSize : length;
  return message.reply({
    embeds: [
      {
        title: "Queue",
        description: `${length} track${
          length === 1 ? "" : "s"
        } [${formattedDuration}]`,
        fields: songs.slice(start, end).map((song, i) => ({
          name: String(i + start + 1),
          value: song === first ? formatPlayback(queue) : formatSong(song),
        })),
        footer: { text: pages > 1 ? `Page ${page} of ${pages}` : "" },
      },
    ],
  });
};

module.exports = Object.assign(queue, {
  aliases: ["q"],
  usage: {
    embeds: [
      {
        fields: [
          {
            name: "NAME",
            value: "lena queue - Show the queue",
          },
          {
            name: "SYNOPSIS",
            value: "**lena queue** [PAGE]\nalias: q",
          },
          {
            name: "DESCRIPTION",
            value:
              "Shows the queue. If PAGE is specified, shows that page of the queue.",
          },
          {
            name: "EXAMPLES",
            value: `
\`lena queue\`
\`lena queue 2\`
\`lena q\`
`,
          },
          {
            name: "SEE ALSO",
            value: `
\`lena help drop\`
\`lena help move\`
\`lena help next\`
\`lena help shuffle\`
\`lena help stop\`
`,
          },
        ],
      },
    ],
  },
});

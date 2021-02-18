const formatPlayback = require("../format-playback.js");
const formatSong = require("../format-song.js");

const songsPerPage = 10;
const integerRegExp = /^-?\d+/;

const queue = function (message, argv) {
  const arg = Number(argv.slice(2).find((arg) => integerRegExp.test(arg)));
  const queue = this.player.getQueue(message);
  if (!queue || queue.songs.length === 0) {
    message.channel.send({ embed: { description: "Nothing in queue" } });
    return;
  }

  const { formattedDuration, songs } = queue;
  const { length } = songs;
  const [first] = songs;
  const pages = Math.ceil(length / songsPerPage);
  const page = arg * songsPerPage > length ? pages : arg || 1;
  const start = (page - 1) * songsPerPage;
  const end = page * songsPerPage < length ? page * songsPerPage : length;
  message.channel.send({
    embed: {
      title: `${length} track${length === 1 ? "" : "s"} [${formattedDuration}]`,
      fields: songs.slice(start, end).map((song, i) => ({
        name: i + 1 + start,
        value: song === first ? formatPlayback(queue) : formatSong(song),
      })),
      footer: { text: pages > 1 ? `Page ${page} of ${pages}` : "" },
    },
  });
};

module.exports = Object.assign(queue, {
  aliases: ["q"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena queue** - Show the queue",
        },
        {
          name: "SYNOPSIS",
          value: "lena queue [PAGE]\nalias: q",
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
  },
});

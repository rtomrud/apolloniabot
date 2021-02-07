const formatSong = require("../format-song.js");

const songsPerPage = 10;

module.exports = function (message) {
  const arg = Number(message.argv.slice(2).find((arg) => /^\d+/.test(arg)));
  const queue = this.player.getQueue(message);
  if (!queue || queue.songs.length === 0) {
    message.channel.send({ embed: { description: "Nothing in queue" } });
    return;
  }

  const { songs } = queue;
  const { length } = songs;
  const [first] = songs;
  const pages = Math.ceil(length / songsPerPage);
  const page = arg * songsPerPage > length ? pages : arg || 1;
  const start = (page - 1) * songsPerPage;
  const end = page * songsPerPage < length ? page * songsPerPage : length;
  message.channel.send({
    embed: {
      description: "Queue:",
      fields: songs.slice(start, end).map((song, i) => ({
        name: i + 1 + start,
        value:
          song === first
            ? `[${song.name}](${song.url}) [${queue.formattedCurrentTime}/${song.formattedDuration}]`
            : formatSong(song),
      })),
      footer: {
        text: pages > 1 ? `Page ${page} of ${pages} (${length} tracks)` : "",
      },
    },
  });
};

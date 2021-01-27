const formatDuration = require("../format-duration.js");

module.exports = function (message, { player }) {
  const arg = Number(message.args.find((arg) => /^\d+/.test(arg))) || 1;
  const queue = player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing in queue" } });
    return;
  }

  const { tracks } = queue;
  const { length } = tracks;
  const pages = Math.ceil(length / 10);
  const page = arg * 10 > length ? pages : arg;
  const start = (page - 1) * 10;
  const end = page * 10 < length ? page * 10 : length;
  message.channel.send({
    embed: {
      description: "Queue:",
      fields: tracks.slice(start, end).map(({ durationMS, title, url }, i) => ({
        name: `${i + 1 + start}${i === 0 ? " 🕪" : ""}`,
        value: `[${title}](${url}) [${formatDuration(durationMS)}]`,
      })),
      footer: {
        text: pages > 1 ? `Page ${page} of ${pages} (${length} tracks)` : "",
      },
    },
  });
};

const formatDuration = require("../format-duration.js");

module.exports = function (message, { player }) {
  const queue = player.getQueue(message);
  if (!queue || queue.tracks.length < 2) {
    message.channel.send({
      embed: { description: "Nothing waiting in queue" },
    });
    return;
  }

  const { tracks } = queue;
  const track = tracks[tracks.length - 1];
  const { durationMS, title, url } = track;
  queue.tracks = [tracks[0], track, ...tracks.slice(1, -1)];
  message.channel.send({
    embed: {
      description: `Next up [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

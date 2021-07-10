module.exports = function (queue) {
  return `${queue.songs.length} track${queue.songs.length === 1 ? "" : "s"} [${
    queue.formattedDuration
  }]`;
};

module.exports = function (queue) {
  const [{ formattedDuration, name, url }] = queue.songs;
  return `[${name}](${url}) [${queue.formattedCurrentTime}/${
    formattedDuration === "00:00" ? "?" : formattedDuration
  }]`;
};

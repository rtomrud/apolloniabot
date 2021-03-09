const getFormattedCurrentTime = (queue) => {
  try {
    // formattedCurrentTime is a getter that may throw
    return queue.formattedCurrentTime;
  } catch (error) {
    return "00:00";
  }
};

module.exports = function (queue) {
  const formattedCurrentTime = getFormattedCurrentTime(queue);
  const [{ formattedDuration, name, url }] = queue.songs;
  return `[${name}](${url}) [${formattedCurrentTime}/${
    formattedDuration === "00:00" ? "?" : formattedDuration
  }]`;
};

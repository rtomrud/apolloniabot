const { formatDuration } = require("distube/src/duration.js");

module.exports = function ({
  beginTime,
  dispatcher,
  songs: [{ formattedDuration, name, url }],
}) {
  const currentTime = dispatcher ? dispatcher.streamTime : 0 + beginTime;
  const formattedCurrentTime = formatDuration(currentTime);
  return `[${name}](${url}) [${formattedCurrentTime}/${formattedDuration}]`;
};

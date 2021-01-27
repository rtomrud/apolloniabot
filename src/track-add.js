const formatDuration = require("./format-duration.js");

module.exports = function (
  message,
  { tracks: { length } },
  { durationMS, title, url }
) {
  if (length === 0) {
    return;
  }

  message.channel.send({
    embed: {
      description: `Queued [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

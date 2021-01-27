const formatDuration = require("./format-duration.js");

module.exports = function (message, query, tracks, collector) {
  collector.stop();
  message.channel.send({
    embed: {
      description: "Found these tracks:",
      fields: tracks
        .slice(0, tracks.length < 10 ? tracks.length : 10)
        .map(({ author, durationMS, title, url }, i) => ({
          name: `${i + 1}. ${author}`,
          value: `[${title}](${url}) [${formatDuration(durationMS)}]`,
        })),
    },
  });
};

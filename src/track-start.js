const formatDuration = require("./format-duration.js");

module.exports = function (message, { durationMS, title, url }) {
  message.channel.send({
    embed: {
      description: `Playing [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

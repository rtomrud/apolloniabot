const formatDuration = require("../format-duration.js");

module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing is playing" } });
    return;
  }

  const {
    additionalStreamTime,
    voiceConnection: {
      dispatcher: { streamTime },
    },
  } = player.getQueue(message);
  const { durationMS, title, url } = player.nowPlaying(message);
  message.channel.send({
    embed: {
      description: `Playing [${title}](${url}) [${formatDuration(
        streamTime + additionalStreamTime
      )}/${formatDuration(durationMS)}]`,
    },
  });
};

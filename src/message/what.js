const formatDuration = require("../format-duration.js");

module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing is playing" } });
    return;
  }

  const {
    additionalStreamTime,
    voiceConnection: {
      dispatcher: { streamTime },
    },
  } = this.player.getQueue(message);
  const { durationMS, title, url } = this.player.nowPlaying(message);
  message.channel.send({
    embed: {
      description: `Playing [${title}](${url}) [${formatDuration(
        streamTime + additionalStreamTime
      )}/${formatDuration(durationMS)}]`,
    },
  });
};

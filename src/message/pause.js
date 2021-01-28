const formatDuration = require("../format-duration.js");

module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to pause" } });
    return;
  }

  const { durationMS, title, url } = this.player.nowPlaying(message);
  this.player.pause(message);
  message.channel.send({
    embed: {
      description: `Paused [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

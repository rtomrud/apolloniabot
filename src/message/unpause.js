const formatDuration = require("../format-duration.js");

module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to resume" } });
    return;
  }

  const { durationMS, title, url } = this.player.nowPlaying(message);
  this.player.resume(message);
  message.channel.send({
    embed: {
      description: `Resumed [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

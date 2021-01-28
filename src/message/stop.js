const formatDuration = require("../format-duration.js");

module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to stop" } });
    return;
  }

  const { durationMS, title, url } = this.player.nowPlaying(message);
  this.player.stop(message);
  message.channel.send({
    embed: {
      description: `Stopped [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

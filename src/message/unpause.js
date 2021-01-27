const formatDuration = require("../format-duration.js");

module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to resume" } });
    return;
  }

  const { durationMS, title, url } = player.nowPlaying(message);
  player.resume(message);
  message.channel.send({
    embed: {
      description: `Resumed [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

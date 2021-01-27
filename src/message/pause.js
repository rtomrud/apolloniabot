const formatDuration = require("../format-duration.js");

module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to pause" } });
    return;
  }

  const { durationMS, title, url } = player.nowPlaying(message);
  player.pause(message);
  message.channel.send({
    embed: {
      description: `Paused [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

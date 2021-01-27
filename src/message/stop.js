const formatDuration = require("../format-duration.js");

module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to stop" } });
    return;
  }

  const { durationMS, title, url } = player.nowPlaying(message);
  player.stop(message);
  message.channel.send({
    embed: {
      description: `Stopped [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

const formatPlayback = require("../format-playback.js");

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({ embed: { description: "Nothing is playing" } });
    return;
  }

  const { autoplay, filter, repeatMode, volume } = queue;
  message.channel.send({
    embed: {
      description: `Playing ${formatPlayback(queue)}

volume: ${volume}%${autoplay ? "\nautoplay: ON" : ""}${
        repeatMode
          ? `\n${repeatMode === 1 ? "repeat track" : "repeat queue"}: ON`
          : ""
      }${filter ? `\n${filter}: ON` : ""}`,
    },
  });
};

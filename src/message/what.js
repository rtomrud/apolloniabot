const formatPlayback = require("../format-playback.js");

const formatStatus = ({ autoplay, filter, repeatMode, volume }) => {
  return `volume: ${volume}%${autoplay ? ", autoplay: on" : ""}${
    repeatMode ? `, loop: ${repeatMode === 2 ? "queue" : "track"}` : ""
  }${filter ? `, effects: ${filter}` : ""}`;
};

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({ embed: { description: "Nothing is playing" } });
    return;
  }

  message.channel.send({
    embed: {
      description: `Playing ${formatPlayback(queue)}\n\n${formatStatus(queue)}`,
    },
  });
};

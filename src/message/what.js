module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({ embed: { description: "Nothing is playing" } });
    return;
  }

  const { autoplay, filter, formattedCurrentTime, repeatMode, volume } = queue;
  const [{ formattedDuration, name, url }] = queue.songs;
  message.channel.send({
    embed: {
      description: `Playing [${name}](${url}) [${formattedCurrentTime}/${formattedDuration}]

volume: ${volume}%${autoplay ? "\nautoplay: ON" : ""}${
        repeatMode
          ? `\n${repeatMode === 1 ? "repeat track" : "repeat queue"}: ON`
          : ""
      }${filter ? `\n${filter}: ON` : ""}`,
    },
  });
};

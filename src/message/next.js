module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || (queue.songs.length <= 1 && !queue.autoplay)) {
    message.channel.send({ embed: { description: "Nothing to skip" } });
    return;
  }

  this.player.skip(message);
};

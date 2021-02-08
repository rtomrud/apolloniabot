module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.autoplay) {
    message.channel.send({ embed: { description: "No autoplay" } });
    return;
  }

  this.player.toggleAutoplay(message);
  message.channel.send({ embed: { description: "Disabled autoplay" } });
};

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to autoplay" } });
    return;
  }

  this.player.toggleAutoplay(message);
  message.channel.send({ embed: { description: "Enabled autoplay" } });
};

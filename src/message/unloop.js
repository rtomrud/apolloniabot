module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to unloop" } });
    return;
  }

  this.player.setRepeatMode(message, 0);
  message.channel.send({ embed: { description: "Disabled loop" } });
};

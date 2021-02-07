module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to repeat" } });
    return;
  }

  this.player.setRepeatMode(message, 1);
  message.channel.send({ embed: { description: "Enabled repeat" } });
};

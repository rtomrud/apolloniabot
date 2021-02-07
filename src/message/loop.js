module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to loop" } });
    return;
  }

  this.player.setRepeatMode(message, 2);
  message.channel.send({ embed: { description: "Enabled loop" } });
};

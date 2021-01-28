module.exports = function (message) {
  if (!this.player.getQueue(message)) {
    message.channel.send({ embed: { description: "Nothing to clear" } });
    return;
  }

  this.player.clearQueue(message);
  message.channel.send({ embed: { description: "Cleared queue" } });
};

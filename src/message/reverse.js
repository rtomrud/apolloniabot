module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to reverse" } });
    return;
  }

  this.player.setFilter(message, "reverse");
  message.channel.send({ embed: { description: "Enabled reverse" } });
};

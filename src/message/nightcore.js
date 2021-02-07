module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to nightcore" } });
    return;
  }

  this.player.setFilter(message, "nightcore");
  message.channel.send({ embed: { description: "Enabled nightcore" } });
};

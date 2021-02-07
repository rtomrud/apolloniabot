module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to vaporwave" } });
    return;
  }

  this.player.setFilter(message, "vaporwave");
  message.channel.send({ embed: { description: "Enabled vaporwave" } });
};

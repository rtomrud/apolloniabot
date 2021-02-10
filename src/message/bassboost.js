module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to bassboost" } });
    return;
  }

  this.player.setFilter(message, "bassboost");
  message.channel.send({ embed: { description: "Enabled bassboost" } });
};

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.filter) {
    message.channel.send({ embed: { description: "No filter" } });
    return;
  }

  this.player.setFilter(message, queue.filter);
  message.channel.send({ embed: { description: "Disabled filter" } });
};

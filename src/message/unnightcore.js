module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.filter !== "nightcore") {
    message.channel.send({ embed: { description: "Nothing to unnightcore" } });
    return;
  }

  this.player.setFilter(message, "nightcore");
  message.channel.send({ embed: { description: "Disabled nightcore" } });
};

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.filter !== "vaporwave") {
    message.channel.send({ embed: { description: "Nothing to unvaporwave" } });
    return;
  }

  this.player.setFilter(message, "vaporwave");
  message.channel.send({ embed: { description: "Disabled vaporwave" } });
};

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.filter !== "reverse") {
    message.channel.send({ embed: { description: "Nothing to unreverse" } });
    return;
  }

  this.player.setFilter(message, "reverse");
  message.channel.send({ embed: { description: "Disabled reverse" } });
};

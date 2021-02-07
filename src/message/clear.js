module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to clear" } });
    return;
  }

  queue.songs = [];
  message.channel.send({ embed: { description: "Cleared queue" } });
};

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.songs.length <= 1) {
    message.channel.send({ embed: { description: "Nothing to shuffle" } });
    return;
  }

  this.player.shuffle(message);
  message.channel.send({ embed: { description: "Shuffled queue" } });
};

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue || queue.tracks.length < 2) {
    message.channel.send({ embed: { description: "Nothing to shuffle" } });
    return;
  }

  this.player.shuffle(message);
  message.channel.send({ embed: { description: "Shuffled queue" } });
};

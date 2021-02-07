const increment = 10;
const min = 10;

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { description: "Nothing to decrease volume to" },
    });
    return;
  }

  const percent = queue.volume - increment;
  if (percent < min) {
    message.channel.send({
      embed: { description: `Volume already at minimum of ${min}%` },
    });
    return;
  }

  this.player.setVolume(message, percent);
  message.channel.send({
    embed: { description: `Decreased volume to ${percent}%` },
  });
};

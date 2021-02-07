const max = 100;

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { description: "Nothing to increase volume to" },
    });
    return;
  }

  if (queue.volume > max) {
    message.channel.send({
      embed: {
        description: "Volume already [at 11](https://youtu.be/4xgx4k83zzc)",
      },
    });
    return;
  }

  this.player.setVolume(message, max);
  message.channel.send({
    embed: { description: `Increased volume to ${max}%` },
  });
};

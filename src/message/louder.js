const increment = 10;
const max = 100;

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { description: "Nothing to increase volume to" },
    });
    return;
  }

  const percent = queue.volume + increment;
  if (percent > max) {
    message.channel.send({
      embed: {
        description: "Volume already [at 11](https://youtu.be/4xgx4k83zzc)",
      },
    });
    return;
  }

  this.player.setVolume(message, percent);
  message.channel.send({
    embed: { description: `Increased volume to ${percent}%` },
  });
};

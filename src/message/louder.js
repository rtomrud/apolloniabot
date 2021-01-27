module.exports = function (message, { player }) {
  const queue = player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { description: "Nothing to increase volume to" },
    });
    return;
  }

  const percent = queue.volume + 10;
  if (percent > 100) {
    message.channel.send({
      embed: {
        description: "Volume already [at 11](https://youtu.be/4xgx4k83zzc)",
      },
    });
    return;
  }

  player.setVolume(message, percent);
  message.channel.send({
    embed: { description: `Increased volume to ${percent}%` },
  });
};

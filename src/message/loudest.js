module.exports = function (message, { player }) {
  const queue = player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { description: "Nothing to increase volume to" },
    });
    return;
  }

  if (queue.volume > 100) {
    message.channel.send({
      embed: {
        description: "Volume already [at 11](https://youtu.be/4xgx4k83zzc)",
      },
    });
    return;
  }

  player.setVolume(message, 100);
  message.channel.send({ embed: { description: "Increased volume to 100%" } });
};

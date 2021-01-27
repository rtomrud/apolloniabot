module.exports = function (message, { player }) {
  const queue = player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { description: "Nothing to decrease volume to" },
    });
    return;
  }

  const percent = queue.volume - 10;
  if (percent < 10) {
    message.channel.send({
      embed: { description: "Volume already at minimum of 10%" },
    });
    return;
  }

  player.setVolume(message, percent);
  message.channel.send({
    embed: { description: `Decreased volume to ${percent}%` },
  });
};

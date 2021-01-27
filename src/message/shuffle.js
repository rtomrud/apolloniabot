module.exports = function (message, { player }) {
  const queue = player.getQueue(message);
  if (!queue || queue.tracks.length < 2) {
    message.channel.send({ embed: { description: "Nothing to shuffle" } });
    return;
  }

  player.shuffle(message);
  message.channel.send({ embed: { description: "Shuffled queue" } });
};

module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to skip" } });
    return;
  }

  player.skip(message);
};

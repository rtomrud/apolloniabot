module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to unloop" } });
    return;
  }

  player.setLoopMode(message, false);
  message.channel.send({ embed: { description: "Disabled loop" } });
};

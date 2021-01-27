module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to loop" } });
    return;
  }

  player.setLoopMode(message, true);
  message.channel.send({ embed: { description: "Enabled loop" } });
};

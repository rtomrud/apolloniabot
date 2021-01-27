module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to unrepeat" } });
    return;
  }

  player.setRepeatMode(message, false);
  message.channel.send({ embed: { description: "Disabled repeat" } });
};

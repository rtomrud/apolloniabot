module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to unrepeat" } });
    return;
  }

  this.player.setRepeatMode(message, false);
  message.channel.send({ embed: { description: "Disabled repeat" } });
};

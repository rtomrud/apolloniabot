module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to repeat" } });
    return;
  }

  this.player.setRepeatMode(message, true);
  message.channel.send({ embed: { description: "Enabled repeat" } });
};

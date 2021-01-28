module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to unloop" } });
    return;
  }

  this.player.setLoopMode(message, false);
  message.channel.send({ embed: { description: "Disabled loop" } });
};

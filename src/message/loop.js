module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to loop" } });
    return;
  }

  this.player.setLoopMode(message, true);
  message.channel.send({ embed: { description: "Enabled loop" } });
};

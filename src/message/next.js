module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to skip" } });
    return;
  }

  this.player.skip(message);
};

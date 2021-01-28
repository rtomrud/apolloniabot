module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to go back to" } });
    return;
  }

  this.player.back(message);
};

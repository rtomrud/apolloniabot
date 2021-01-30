module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to reverse" } });
    return;
  }

  this.player.setFilters(message, { reverse: true });
  message.channel.send({ embed: { description: "Enabled reverse" } });
};

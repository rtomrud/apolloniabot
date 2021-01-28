module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to vaporwave" } });
    return;
  }

  this.player.setFilters(message, { vaporwave: true });
  message.channel.send({ embed: { description: "Enabled vaporwave" } });
};

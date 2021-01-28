module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to unvaporwave" } });
    return;
  }

  this.player.setFilters(message, { vaporwave: false });
  message.channel.send({ embed: { description: "Disabled vaporwave" } });
};

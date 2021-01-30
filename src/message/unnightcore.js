module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to nightcore" } });
    return;
  }

  this.player.setFilters(message, { nightcore: false });
  message.channel.send({ embed: { description: "Disabled nightcore" } });
};

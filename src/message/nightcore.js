module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to nightcore" } });
    return;
  }

  this.player.setFilters(message, { nightcore: true });
  message.channel.send({ embed: { description: "Enabled nightcore" } });
};

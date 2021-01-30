module.exports = function (message) {
  if (!this.player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to unreverse" } });
    return;
  }

  this.player.setFilters(message, { reverse: false });
  message.channel.send({ embed: { description: "Disabled reverse" } });
};

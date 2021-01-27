module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to vaporwave" } });
    return;
  }

  player.setFilters(message, { vaporwave: true });
  message.channel.send({ embed: { description: "Enabled vaporwave" } });
};

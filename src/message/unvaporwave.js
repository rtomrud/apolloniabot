module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to unvaporwave" } });
    return;
  }

  player.setFilters(message, { vaporwave: false });
  message.channel.send({ embed: { description: "Disabled vaporwave" } });
};

module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to repeat" } });
    return;
  }

  player.setRepeatMode(message, true);
  message.channel.send({ embed: { description: "Enabled repeat" } });
};

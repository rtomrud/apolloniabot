module.exports = function (message, { player }) {
  if (!player.isPlaying(message)) {
    message.channel.send({ embed: { description: "Nothing to go back to" } });
    return;
  }

  player.back(message);
};

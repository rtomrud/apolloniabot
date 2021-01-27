module.exports = function (message, { player }) {
  if (!player.getQueue(message)) {
    message.channel.send({ embed: { description: "Nothing to clear" } });
    return;
  }

  player.clearQueue(message);
  message.channel.send({ embed: { description: "Cleared queue" } });
};

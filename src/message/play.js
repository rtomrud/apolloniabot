module.exports = function (message, { player }) {
  const query = message.args.join(" ");
  if (!query) {
    message.channel.send({
      embed: { description: "I don't know what you want to play" },
    });
    return;
  }

  player.play(message, query, true);
};

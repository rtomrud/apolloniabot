module.exports = function (message, { player }) {
  const query = message.args.join(" ");
  if (!query) {
    message.channel.send({
      embed: { description: "I don't know what you want to find" },
    });
    return;
  }

  player.play(message, query);
};

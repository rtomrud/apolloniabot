module.exports = function (message) {
  const query = message.argv.slice(2).join(" ");
  if (!query) {
    message.channel.send({
      embed: { description: "I don't know what you want to find" },
    });
    return;
  }

  this.player.play(message, query);
};

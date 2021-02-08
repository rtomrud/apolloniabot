const oneRegExp = /1|1st|one|first|track|song|current/i;

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to loop" } });
    return;
  }

  const arg = message.argv.slice(2).find((arg) => oneRegExp.test(arg));
  if (arg) {
    this.player.setRepeatMode(message, 1);
    message.channel.send({
      embed: { description: "Looping the current track" },
    });
    return;
  }

  this.player.setRepeatMode(message, 2);
  message.channel.send({ embed: { description: "Looping the queue" } });
};

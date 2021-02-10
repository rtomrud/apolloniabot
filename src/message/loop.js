const operandRegExp = /(queue|songs|on|all|yes|true|enable)|(track|song|one|current|playing)|(off|none|no|false|disable)/i;

module.exports = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to loop" } });
    return;
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  if (!arg) {
    message.channel.send({
      embed: {
        description:
          "I don't know whether you want to loop the _queue_, a _track_, or turn looping _off_",
      },
    });
    return;
  }

  const [, all, song] = operandRegExp.exec(arg);
  if (all) {
    if (queue.repeatMode !== 2) {
      this.player.setRepeatMode(message, 2);
    }

    message.channel.send({ embed: { description: "Looping the queue" } });
    return;
  }

  if (song) {
    if (queue.repeatMode !== 1) {
      this.player.setRepeatMode(message, 1);
    }

    message.channel.send({
      embed: { description: "Looping the current track" },
    });
    return;
  }

  this.player.setRepeatMode(message, 0);
  message.channel.send({ embed: { description: "Looping disabled" } });
};

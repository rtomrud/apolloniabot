const operandRegExp = /off|none|no|false|disable/i;

module.exports = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to autoplay" } });
    return;
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  if (arg) {
    if (queue.autoplay) {
      this.player.toggleAutoplay(message);
    }

    message.channel.send({ embed: { description: "Disabled autoplay" } });
    return;
  }

  if (!queue.autoplay) {
    this.player.toggleAutoplay(message);
  }

  message.channel.send({ embed: { description: "Enabled autoplay" } });
};

const filterRegExp = /(off|none|no|false|disable)|(bassboost|nightcore|reverse|vaporwave)/i;

module.exports = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { description: "Nothing to apply effect to" },
    });
    return;
  }

  const arg = argv.slice(2).find((arg) => filterRegExp.test(arg));
  if (!arg) {
    message.channel.send({
      embed: { description: "I don't know what effect you want to apply" },
    });
    return;
  }

  const [, off, filterName] = filterRegExp.exec(arg);
  if (off) {
    this.player.setFilter(message, queue.filter);
    message.channel.send({ embed: { description: "Disabled effects" } });
    return;
  }

  const filter = filterName.toLowerCase();
  if (filter !== queue.filter) {
    this.player.setFilter(message, filter);
  }

  message.channel.send({ embed: { description: `Enabled ${filter} effect` } });
};

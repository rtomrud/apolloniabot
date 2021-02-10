const integerRegExp = /^-?\d+/;

module.exports = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to drop" } });
    return;
  }

  const { length } = queue.songs;
  const [arg1, arg2] = argv
    .slice(2)
    .filter((arg) => integerRegExp.test(arg))
    .map((arg) => Number(arg));
  const start = (arg1 != null ? arg1 : length) - 1;
  const deleteCount = arg2 > arg1 ? arg2 - arg1 + 1 : 1;
  if (start < 0 || start >= length) {
    message.channel.send({
      embed: { description: "I can't drop that because it's not in the queue" },
    });
    return;
  }

  if (start === 0 && queue.playing) {
    message.channel.send({
      embed: { description: "I can't drop track 1 because it's playing now" },
    });
    return;
  }

  const { length: deletes } = queue.songs.splice(start, deleteCount);
  message.channel.send({
    embed: {
      description: `Dropped track${deletes > 1 ? "s" : ""} ${start + 1}${
        deletes > 1 ? ` to ${start + deletes}` : ""
      }`,
    },
  });
};

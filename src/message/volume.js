const min = 1;
const max = 100;
const percentRegExp = /^\d+(\.\d+)?%?/;

module.exports = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { description: "Nothing to set volume to" },
    });
    return;
  }

  const arg = argv.slice(2).find((arg) => percentRegExp.test(arg));
  if (!arg) {
    message.channel.send({
      embed: { description: "I don't know what volume you want" },
    });
    return;
  }

  const percent = Math.round(arg.replace("%", ""));
  if (percent < min) {
    message.channel.send({
      embed: { description: "I can't set my volume below 1%" },
    });
    return;
  }

  if (percent > max) {
    message.channel.send({
      embed: {
        description: "I can't [go to 11](https://youtu.be/4xgx4k83zzc)",
      },
    });
    return;
  }

  this.player.setVolume(message, percent);
  message.channel.send({ embed: { description: `Set volume to ${percent}%` } });
};

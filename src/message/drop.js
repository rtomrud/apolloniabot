const formatDuration = require("../format-duration.js");

module.exports = function (message, { player }) {
  const queue = player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to drop" } });
    return;
  }

  const arg = Number(message.argv.slice(2).find((arg) => /^-?\d+/.test(arg)));
  const { tracks } = queue;
  const { length } = tracks;
  if (arg < 1 || arg > length) {
    message.channel.send({
      embed: {
        description: "I can't drop that track because it doesn't exist",
      },
    });
    return;
  }

  const position = (arg || length) - 1;
  if (position === 0) {
    message.channel.send({
      embed: { description: "I can't drop track 1 because it's playing now" },
    });
    return;
  }

  const { durationMS, title, url } = tracks[position];
  player.remove(message, position);
  message.channel.send({
    embed: {
      description: `Dropped track ${
        position + 1
      }: [${title}](${url}) [${formatDuration(durationMS)}]`,
    },
  });
};

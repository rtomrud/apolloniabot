const formatPlayback = require("../format-playback.js");

const timeRegExp = /^(?:(?:(\d{1,2}):)?(\d{1,2}):)?(\d+(?:\.\d{1,3})?)s?/;

const timeToMs = (time) => {
  const [, h = 0, m = 0, s] = timeRegExp.exec(time);
  return Number(h) * 3600000 + Number(m) * 60000 + Number(s) * 1000;
};

module.exports = function (message) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to seek on" } });
    return;
  }

  const arg = message.argv.slice(2).find((arg) => timeRegExp.test(arg));
  if (!arg) {
    message.channel.send({
      embed: { description: "I don't know to what time you want to seek" },
    });
    return;
  }

  const time = timeToMs(arg);
  if (time >= queue.songs[0].duration * 1000) {
    message.channel.send({
      embed: {
        description:
          "I can't seek to that time because the current song isn't that long",
      },
    });
    return;
  }

  this.player.seek(message, time);
  message.channel.send({
    embed: { description: `Playing ${formatPlayback(queue)}` },
  });
};

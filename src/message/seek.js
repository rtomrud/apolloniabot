const formatPlayback = require("../format-playback.js");

const timeRegExp = /^([+-])?(?:(?:(\d{1,2}):)?(\d{1,2}):)?(\d+(?:\.\d{1,3})?)s?/;

module.exports = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({ embed: { description: "Nothing to seek on" } });
    return;
  }

  const arg = argv.slice(2).find((arg) => timeRegExp.test(arg));
  if (!arg) {
    message.channel.send({
      embed: { description: "I don't know to what time you want to seek" },
    });
    return;
  }

  const [{ duration }] = queue.songs;
  const [, sign = "", h = 0, m = 0, s] = timeRegExp.exec(arg);
  const ms = Number(h) * 3600000 + Number(m) * 60000 + Number(s) * 1000;
  const t =
    sign === "+"
      ? queue.currentTime + ms
      : sign === "-"
      ? queue.currentTime - ms
      : ms;
  this.player.seek(message, Math.max(0, Math.min(t, duration * 1000)));
  message.channel.send({
    embed: { description: `Playing ${formatPlayback(queue)}` },
  });
};

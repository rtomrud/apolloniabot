module.exports = function (message, queue, { songs: { length } }) {
  message.channel.send({
    embed: { description: `Queued ${length} track${length === 1 ? "" : "s"}` },
  });
};

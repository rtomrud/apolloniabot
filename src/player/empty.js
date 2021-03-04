module.exports = function (message) {
  message.channel.send({
    embed: { title: "Stopped", description: "The voice channel is empty" },
  });
};

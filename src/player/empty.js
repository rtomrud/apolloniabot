module.exports = function (message) {
  message.channel.send({
    embed: {
      description: "Stopped because the voice channel is empty",
    },
  });
};

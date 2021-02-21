module.exports = function (message) {
  message.channel.send({
    embed: {
      description: "I left the voice channel because no one was listening",
    },
  });
};

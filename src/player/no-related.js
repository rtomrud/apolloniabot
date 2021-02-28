module.exports = function (message) {
  message.channel.send({
    embed: {
      description:
        "Stopped because the queue is finished and I can't autoplay anything",
    },
  });
};

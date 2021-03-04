module.exports = function (message) {
  message.channel.send({
    embed: {
      title: "Stopped",
      description: "The queue is finished and I can't autoplay anything",
    },
  });
};

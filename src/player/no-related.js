module.exports = async function (message) {
  return message.channel.send({
    embed: {
      title: "Stopped",
      description: "The queue is finished and I can't autoplay anything",
    },
  });
};

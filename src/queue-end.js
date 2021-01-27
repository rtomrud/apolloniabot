module.exports = function (message) {
  message.channel.send({
    embed: { description: "Reached the end of the queue" },
  });
};

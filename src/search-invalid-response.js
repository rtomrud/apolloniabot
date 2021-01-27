module.exports = function (message) {
  message.channel.send({
    embed: { description: "I couldn't perform the search" },
  });
};

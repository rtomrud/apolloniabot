module.exports = function (message) {
  message.channel.send({ embed: { description: "Disconnected" } });
};

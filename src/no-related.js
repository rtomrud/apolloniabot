module.exports = function (message) {
  message.channel.send({
    embed: {
      description: "I can't autoplay because I could't find any related song",
    },
  });
};

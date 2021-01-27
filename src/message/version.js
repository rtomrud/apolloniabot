const version = `${new Date().toISOString().slice(0, -5)}Z`;

module.exports = function (message) {
  message.channel.send({ embed: { description: version } });
};

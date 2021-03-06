module.exports = async function (message) {
  return message.channel.send({
    embed: { title: "Stopped", description: "The voice channel is empty" },
  });
};

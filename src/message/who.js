const who = async function (message) {
  return message.channel.send({
    embed: {
      title: "Hi, I'm Lena!",
      description: `I play music. Type \`lena help\` to find out what I can do for you.`,
    },
  });
};

module.exports = Object.assign(who, { aliases: ["info"], safe: true });

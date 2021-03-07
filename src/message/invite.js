const invite = async function (message) {
  return message.channel.send({
    embed: {
      title: "Hi, I'm Lena!",
      description: `[Click here to invite me to your server!](https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=3165248&scope=bot)`,
    },
  });
};

module.exports = Object.assign(invite, { aliases: ["join"], safe: true });

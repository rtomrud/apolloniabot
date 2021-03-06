const who = async function (message) {
  return message.channel.send({
    embed: {
      title: "Hi, I'm Lena!",
      description: `
I play music. Type \`lena help\` to find out what I can do for you.

I need [permission](https://support.discord.com/hc/en-us/articles/206029707-How-do-I-set-up-Permissions-) to:

- View Channels (Read Messages), so that I can read what you tell me
- Send Messages, so that I can talk with you
- Embed Links, so that I can answer your commands
- Add Reactions, so that I can react to your messages
- Connect, so that I can join you in a voice channel
- Speak, so that I can play music for you

Need help? Join my [Discord server](https://discord.gg/wp3HWnUDMa)!

You may want to [invite me to your server](https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=3165248&scope=bot).
`,
    },
  });
};

module.exports = Object.assign(who, {
  aliases: ["whois", "info", "invite", "perms", "permission", "permissions"],
  safe: true,
});

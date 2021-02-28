const { Permissions } = require("discord.js");

const {
  FLAGS: { MANAGE_GUILD },
} = Permissions;
const operandRegExp = /off|none|no|false|disable/i;

const dj = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing playing" } });
    return;
  }

  if (!message.member.permissions.has(MANAGE_GUILD)) {
    message.channel.send({
      embed: {
        description:
          "I can't do that because you don't have the Manage Server permission",
      },
    });
    return;
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  if (arg) {
    queue.dj = false;
    message.channel.send({ embed: { description: "Disabled DJ mode" } });
    return;
  }

  queue.dj = true;
  message.channel.send({ embed: { description: "Enabled DJ mode" } });
};

module.exports = Object.assign(dj, {
  aliases: ["priority"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena dj** - DJ mode",
        },
        {
          name: "SYNOPSIS",
          value: "lena dj (on|off)",
        },
        {
          name: "DESCRIPTION",
          value:
            "Denies permission to use all commands that modify the player's state to users without the Priority Speaker permission if **on** is specified. Disables DJ mode if **off** is specified. Defaults to **on**.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena dj on\`
\`lena dj off\`
`,
        },
        {
          name: "SEE ALSO",
          value: `
\`lena help what\`
`,
        },
      ],
    },
  },
});

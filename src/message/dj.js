const { Permissions } = require("discord.js");

const {
  FLAGS: { PRIORITY_SPEAKER },
} = Permissions;
const operandRegExp = /off|none|no|false|disable/i;

const dj = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { title: "Error", description: "Nothing to set DJ mode to" },
    });
    return;
  }

  if (!message.member.permissions.has(PRIORITY_SPEAKER)) {
    message.channel.send({
      embed: {
        title: "Error",
        description:
          "You need the Priority Speaker permission to enable DJ mode",
      },
    });
    return;
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  queue.dj = !arg;
  message.channel.send({
    embed: { title: queue.dj ? "Enabled DJ mode" : "Disabled DJ mode" },
  });
  this.storage.setItem(`${message.guild.id}.dj`, queue.dj);
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

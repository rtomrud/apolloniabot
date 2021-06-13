const { Permissions } = require("discord.js");

const {
  FLAGS: { PRIORITY_SPEAKER },
} = Permissions;
const operandRegExp = /off|none|no|false|disable/i;

const dj = async function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    return message.reply({
      embed: { title: "Error", description: "Nothing to set DJ mode to" },
    });
  }

  if (!message.member.permissions.has(PRIORITY_SPEAKER)) {
    return message.reply({
      embed: {
        title: "Error",
        description:
          "You need the Priority Speaker permission to enable DJ mode",
      },
    });
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  queue.dj = !arg;
  return message.reply({
    embed: { title: queue.dj ? "Enabled DJ mode" : "Disabled DJ mode" },
  });
};

module.exports = Object.assign(dj, {
  aliases: ["priority"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "lena dj - DJ mode",
        },
        {
          name: "SYNOPSIS",
          value: "**lena dj** (on|off)",
        },
        {
          name: "DESCRIPTION",
          value:
            "Denies access to commands that modify the queue or the playback's settings to members without the Priority Speaker permission if **on** is specified. Disables DJ mode if **off** is specified. Defaults to **on**. You need the Priority Speaker permission to use this command.",
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

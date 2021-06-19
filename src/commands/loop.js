const operandRegExp =
  /(queue|songs|on|all|yes|true|enable)|(track|song|one|current|playing)|(off|none|no|false|disable)/i;

const loop = async function (player, message, argv) {
  const queue = player.getQueue(message);
  if (!queue) {
    return message.reply({
      embeds: [{ title: "Error", description: "Nothing to loop" }],
    });
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  if (!arg) {
    return message.reply({
      embeds: [
        {
          title: "Error",
          description:
            "I don't know whether you want to loop the **queue**, a **track**, or turn looping **off**",
        },
      ],
    });
  }

  const [, all, song] = operandRegExp.exec(arg);
  queue.setRepeatMode(all ? 2 : song ? 1 : 0);
  return message.reply({
    embeds: [
      {
        title: ["Disabled looping", "Looping track", "Looping queue"][
          queue.repeatMode
        ],
      },
    ],
  });
};

module.exports = Object.assign(loop, {
  aliases: ["l", "repeat"],
  usage: {
    embeds: [
      {
        fields: [
          {
            name: "NAME",
            value: "lena loop - Loop the queue or current track",
          },
          {
            name: "SYNOPSIS",
            value: "**lena loop** (queue|track|off)\nalias: l",
          },
          {
            name: "DESCRIPTION",
            value:
              "Loops the queue if **queue** is specified. Loops the current track if **track** is specified. Disables looping if **off** is specified.",
          },
          {
            name: "EXAMPLES",
            value: `
\`lena loop queue\`
\`lena loop track\`
\`lena loop off\`
\`lena l off\`
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
    ],
  },
});

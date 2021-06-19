const operandRegExp = /off|none|no|false|disable/i;

const autoplay = async function (player, message, argv) {
  const queue = player.getQueue(message);
  if (!queue) {
    return message.reply({
      embeds: [{ title: "Error", description: "Nothing to autoplay" }],
    });
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  if ((arg && queue.autoplay) || (!arg && !queue.autoplay)) {
    queue.toggleAutoplay();
  }

  return message.reply({
    embeds: [
      { title: queue.autoplay ? "Enabled autoplay" : "Disabled autoplay" },
    ],
  });
};

module.exports = Object.assign(autoplay, {
  aliases: ["a", "related"],
  usage: {
    embeds: [
      {
        fields: [
          {
            name: "NAME",
            value: "lena autoplay - Autoplay music",
          },
          {
            name: "SYNOPSIS",
            value: "**lena autoplay** (on|off)\nalias: a",
          },
          {
            name: "DESCRIPTION",
            value:
              "Autoplays a related track once the queue reaches the end if **on** is specified. Disables autoplay if **off** is specified. Defaults to **on**.",
          },
          {
            name: "EXAMPLES",
            value: `
\`lena autoplay on\`
\`lena autoplay off\`
\`lena a off\`
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

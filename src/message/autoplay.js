const operandRegExp = /off|none|no|false|disable/i;

const autoplay = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({ embed: { description: "Nothing to autoplay" } });
    return;
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  if (arg) {
    if (queue.autoplay) {
      this.player.toggleAutoplay(message);
    }

    message.channel.send({ embed: { description: "Disabled autoplay" } });
    return;
  }

  if (!queue.autoplay) {
    this.player.toggleAutoplay(message);
  }

  message.channel.send({ embed: { description: "Enabled autoplay" } });
};

module.exports = Object.assign(autoplay, {
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena autoplay** - Autoplay music",
        },
        {
          name: "SYNOPSIS",
          value: "lena autoplay (on|off)\nalias: a",
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
  },
});

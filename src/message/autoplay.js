const operandRegExp = /off|none|no|false|disable/i;

const autoplay = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { title: "Error", description: "Nothing to autoplay" },
    });
    return;
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  if (arg) {
    if (queue.autoplay) {
      this.player.toggleAutoplay(message);
    }

    message.channel.send({ embed: { title: "Disabled autoplay" } });
  } else {
    if (!queue.autoplay) {
      this.player.toggleAutoplay(message);
    }

    message.channel.send({ embed: { title: "Enabled autoplay" } });
  }

  this.storage.setItem(`${message.guild.id}.autoplay`, queue.autoplay);
};

module.exports = Object.assign(autoplay, {
  aliases: ["a", "related"],
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

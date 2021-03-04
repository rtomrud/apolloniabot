const operandRegExp = /(queue|songs|on|all|yes|true|enable)|(track|song|one|current|playing)|(off|none|no|false|disable)/i;

const loop = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { title: "Error", description: "Nothing to loop" },
    });
    return;
  }

  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  if (!arg) {
    message.channel.send({
      embed: {
        title: "Error",
        description:
          "I don't know whether you want to loop the **queue**, a **track**, or turn looping **off**",
      },
    });
    return;
  }

  const [, all, song] = operandRegExp.exec(arg);
  this.player.setRepeatMode(message, all ? 2 : song ? 1 : 0);
  message.channel.send({
    embed: {
      title: [
        "Disabled looping",
        "Looping the current track",
        "Looping the queue",
      ][queue.repeatMode],
    },
  });
  this.storage.setItem(`${message.guild.id}.loop`, queue.repeatMode);
};

module.exports = Object.assign(loop, {
  aliases: ["l", "repeat"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena loop** - Loop the queue or current track",
        },
        {
          name: "SYNOPSIS",
          value: "lena loop (queue|track|off)\nalias: l",
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
  },
});

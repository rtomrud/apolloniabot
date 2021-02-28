const help = function (message, argv, alias) {
  if (argv.length > 2) {
    const command = alias(argv.slice(1));
    if (command && command.usage) {
      message.channel.send(command.usage);
      return;
    }
  }

  message.channel.send({
    embed: {
      fields: [
        {
          name: "NAME",
          value: "[**Lena**](https://discord.gg/wp3HWnUDMa) - I play music",
        },
        {
          name: "SYNOPSIS",
          value: "lena COMMAND [ARGS]",
        },
        {
          name: "COMMANDS",
          value: `
**play**, **p** (URL|QUERY|FILE)
**find**, **f** QUERY
**pause**, **sh**
**resume**, **r**
**what**, **w**
**queue**, **q** [PAGE]
**next**, **n**
**move**, **m** [FROM] [TO]
**shuffle**, **s**
**drop**, **d** [START] [END]
**stop**
**seek**, **t** TIME
**volume**, **v** PERCENT
**autoplay**, **a** (on|off)
**loop**, **l** (queue|track|off)
**effect**, **e** (EFFECT|off)
`,
        },
        {
          name: "EXAMPLES",
          value: `\`lena play Bohemian Rhapsody\``,
        },
        {
          name: "SEE ALSO",
          value: `
\`lena help play\`
\`lena help find\`
\`lena help pause\`
\`lena help resume\`
\`lena help what\`
\`lena help queue\`
\`lena help next\`
\`lena help move\`
\`lena help shuffle\`
\`lena help drop\`
\`lena help stop\`
\`lena help seek\`
\`lena help volume\`
\`lena help autoplay\`
\`lena help loop\`
\`lena help effect\`
`,
        },
      ],
    },
  });
};

module.exports = Object.assign(help, {
  aliases: ["--help"],
  safe: true,
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena help** - Show help",
        },
        {
          name: "SYNOPSIS",
          value: "lena help [COMMAND]",
        },
        {
          name: "DESCRIPTION",
          value:
            "Shows help. If a COMMAND is specified, it shows help about that command.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena help play\`
\`lena help effect\`
`,
        },
        {
          name: "SEE ALSO",
          value: `
\`lena who\`
`,
        },
      ],
    },
  },
});

const help = async function (message, argv, commands) {
  if (argv.length > 2) {
    const command = commands(argv.slice(1));
    if (command && command.usage) {
      return message.reply(command.usage);
    }
  }

  return message.reply({
    embed: {
      title: "Lena Bot",
      url: "https://discord.gg/wp3HWnUDMa",
      fields: [
        {
          name: "NAME",
          value: `[Lena](https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=3165248&scope=bot) - I play music`,
        },
        {
          name: "SYNOPSIS",
          value: "**lena** COMMAND [ARGS]",
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
**drop**, **d** [POSITION]
**stop**
**seek**, **t** TIME
**volume**, **v** PERCENT
**autoplay**, **a** (on|off)
**loop**, **l** (queue|track|off)
**effect**, **e** EFFECT (on|off)
**dj** (on|off)
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
\`lena help dj\`
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

const subcommandRegExp =
  /(clear|3d|bassboost|echo|karaoke|nightcore|vaporwave|flanger|gate|haas|reverse|surround|mcompand|phaser|tremolo|earwax|0.25|0.5|0.75|1.25|1.5|1.75|2)/i;
const operandRegExp = /off|none|no|false|disable/i;

const effect = async function (player, message, argv) {
  const queue = player.getQueue(message);
  if (!queue || !queue.playing) {
    return message.reply({
      embed: { title: "Error", description: "Nothing to apply effect to" },
    });
  }

  const subcommand = argv.slice(2).find((arg) => subcommandRegExp.test(arg));
  if (!subcommand) {
    return message.reply({
      embed: {
        title: "Error",
        description: "I don't know what effect you want to apply",
      },
    });
  }

  const filter = subcommand.toLowerCase();
  const isFilterEnabled = queue.filters.includes(filter);
  const arg = argv.slice(2).find((arg) => operandRegExp.test(arg));
  if (filter === "clear") {
    queue.setFilter(false);
  } else if ((isFilterEnabled && arg) || (!isFilterEnabled && !arg)) {
    queue.setFilter(filter);
  }

  return message.reply(
    queue.filters.length > 0
      ? {
          embed: {
            title: "Enabled effects",
            description: queue.filters.join(", "),
          },
        }
      : { embed: { title: "Disabled effects" } }
  );
};

module.exports = Object.assign(effect, {
  aliases: ["e", "fx", "effects", "filter", "filters", "mode", "modes"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "lena effect - Apply an effect to the audio stream",
        },
        {
          name: "SYNOPSIS",
          value: "**lena effect** EFFECT (on|off)\naliases: e, fx",
        },
        {
          name: "DESCRIPTION",
          value:
            "Filters the audio stream by applying the specified EFFECT if **on** is specified. Disables EFFECT if **off** is specified. EFFECT must be **bassboost**, **karaoke**, **nightcore**, **vaporwave**, **0.25**, **0.5**, **0.75**, **1.25**, **1.5**, **1.75**, **2**. Disables all effects if EFFECT is **clear**.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena effect bassboost on\`
\`lena effect vaporwave off\`
\`lena effect 1.25 on\`
\`lena effect clear\`
\`lena e clear\`
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

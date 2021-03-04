const filterRegExp = /(off|none|no|false|disable)|(3d|bassboost|echo|karaoke|nightcore|vaporwave|flanger|gate|haas|reverse|surround|mcompand|phaser|tremolo|earwax|0.25|0.5|0.75|1.25|1.5|1.75|2)/i;

const effect = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue || !queue.playing) {
    message.channel.send({
      embed: { title: "Error", description: "Nothing to apply effect to" },
    });
    return;
  }

  const arg = argv.slice(2).find((arg) => filterRegExp.test(arg));
  if (!arg) {
    message.channel.send({
      embed: {
        title: "Error",
        description: "I don't know what effect you want to apply",
      },
    });
    return;
  }

  const [, off, filter] = filterRegExp.exec(arg);
  this.player.setFilter(message, off ? queue.filter : filter.toLowerCase());
  message.channel.send({
    embed: {
      title: queue.filter
        ? `Enabled ${queue.filter} effect`
        : "Disabled effecs",
    },
  });
  this.storage.setItem(`${message.guild.id}.effect`, queue.filter);
};

module.exports = Object.assign(effect, {
  aliases: ["e", "fx", "effects", "filter", "filters", "mode", "modes"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena effect** - Apply an effect to the audio stream",
        },
        {
          name: "SYNOPSIS",
          value: "lena effect (EFFECT|off)\naliases: e, fx",
        },
        {
          name: "DESCRIPTION",
          value:
            "Filters the audio stream by applying the specified EFFECT. Disables effects if **off** is specified. EFFECT must be **bassboost**, **karaoke**, **nightcore**, **vaporwave**, **0.25**, **0.5**, **0.75**, **1.25**, **1.5**, **1.75**, **2**",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena effect bassboost\`
\`lena effect vaporwave\`
\`lena effect 1.25\`
\`lena effect off\`
\`lena e off\`
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

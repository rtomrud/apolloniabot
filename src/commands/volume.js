const min = 1;
const max = 100;
const percentRegExp = /^\d+(\.\d+)?%?/;

const volume = async function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    return message.reply({
      embed: { title: "Error", description: "Nothing to set volume to" },
    });
  }

  const arg = argv.slice(2).find((arg) => percentRegExp.test(arg));
  if (!arg) {
    return message.reply({
      embed: {
        title: "Error",
        description: "I don't know what volume you want",
      },
    });
  }

  const percent = Math.round(arg.replace("%", ""));
  if (percent < min) {
    return message.reply({
      embed: { title: "Error", description: "I can't set the volume that low" },
    });
  }

  if (percent > max) {
    return message.reply({
      embed: {
        title: "Error",
        description: "I can't [go to 11](https://youtu.be/4xgx4k83zzc)",
      },
    });
  }

  this.player.setVolume(message, percent);
  return message.reply({
    embed: { title: "Volume set", description: `${percent}%` },
  });
};

module.exports = Object.assign(volume, {
  aliases: ["v", "loudness"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "lena volume - Set the volume",
        },
        {
          name: "SYNOPSIS",
          value: "**lena volume** PERCENT\nalias: v",
        },
        {
          name: "DESCRIPTION",
          value: "Sets the volume to the specified PERCENT (1-100).",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena volume 100\`
\`lena volume 50\`
\`lena v 100\`
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

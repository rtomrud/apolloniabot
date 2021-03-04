const min = 1;
const max = 100;
const percentRegExp = /^\d+(\.\d+)?%?/;

const volume = function (message, argv) {
  const queue = this.player.getQueue(message);
  if (!queue) {
    message.channel.send({
      embed: { title: "Error", description: "Nothing to set volume to" },
    });
    return;
  }

  const arg = argv.slice(2).find((arg) => percentRegExp.test(arg));
  if (!arg) {
    message.channel.send({
      embed: {
        title: "Error",
        description: "I don't know what volume you want",
      },
    });
    return;
  }

  const percent = Math.round(arg.replace("%", ""));
  if (percent < min) {
    message.channel.send({
      embed: { title: "Error", description: "I can't set the volume that low" },
    });
    return;
  }

  if (percent > max) {
    message.channel.send({
      embed: {
        title: "Error",
        description: "I can't [go to 11](https://youtu.be/4xgx4k83zzc)",
      },
    });
    return;
  }

  this.player.setVolume(message, percent);
  message.channel.send({
    embed: { title: "Volume set", description: `${percent}%` },
  });
  this.storage.setItem(`${message.guild.id}.volume`, queue.volume);
};

module.exports = Object.assign(volume, {
  aliases: ["v", "loudness"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena volume** - Set the volume",
        },
        {
          name: "SYNOPSIS",
          value: "lena volume PERCENT\nalias: v",
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

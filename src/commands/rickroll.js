const neverGonnaGiveYouUp = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const rickroll = async function (player, message) {
  player.play(message, neverGonnaGiveYouUp);
  return null;
};

module.exports = Object.assign(rickroll, {
  aliases: ["rick"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "lena rickroll - Rick Rolls",
        },
        {
          name: "SYNOPSIS",
          value: "**lena rickroll**\nalias: rick",
        },
        {
          name: "DESCRIPTION",
          value: 'Plays Rick Astley\'s "Never Gonna Give You Up".',
        },
        {
          name: "EXAMPLES",
          value: `
\`lena rickroll\`
\`lena rick\`
`,
        },
        {
          name: "SEE ALSO",
          value: `
\`lena help find\`
\`lena help play\`
`,
        },
      ],
    },
  },
});

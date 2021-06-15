const play = async function (message, argv) {
  const args = argv.slice(2);
  if (args.length === 0 && message.attachments.size === 0) {
    return message.reply({
      embed: {
        title: "Error",
        description: "I don't know what you want to play",
      },
    });
  }

  const { attachments } = message;
  if (attachments.size > 0) {
    const { width, url } = attachments.values().next().value;
    if (width) {
      return message.reply({
        embed: {
          title: "Error",
          description: "I can't play that because it's not a valid file format",
        },
      });
    }

    this.player.play(message, url);
    return new Promise((resolve) => {
      message.channel
        .createMessageCollector(
          ({ attachments }) =>
            attachments.size > 0 && !attachments.values().next().value.width,
          { time: 3000 }
        )
        .on("collect", (message) =>
          this.player.play(
            message,
            message.attachments.values().next().value.url
          )
        )
        .on("end", (collected) => resolve([...collected.values()]));
    });
  }

  this.player.play(message, args.join(" "));
  return null;
};

module.exports = Object.assign(play, {
  aliases: ["p"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "lena play - Play music",
        },
        {
          name: "SYNOPSIS",
          value: "**lena play** (URL|QUERY|FILE)\nalias: p",
        },
        {
          name: "DESCRIPTION",
          value:
            "Plays a track or playlist. If a URL from YouTube, Spotify or another site is specified, it plays that URL. The URL can be a track, from almost any site, or a playlist from YouTube or Spotify. If a QUERY is specified, it searches that query on YouTube and plays the first result. If a FILE is attached, it plays that file.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena play Bohemian Rhapsody\`
\`lena play https://youtu.be/fdixQDPA2h0\`
\`lena p https://youtube.com/playlist?list=OLAK5uy_mHMBxzRe_v1MEyVhqGI8pBdUaqTJGNFKk\`
\`lena play\` (with a file attachment)
`,
        },
        {
          name: "SEE ALSO",
          value: `
\`lena help find\`
\`lena help what\`
`,
        },
      ],
    },
  },
});
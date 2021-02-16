const { getPreview, getTracks } = require("spotify-url-info");

const spotifyListRegExp = /^https:\/\/open\.spotify\.com\/(playlist|artist|album)\/(\w|-){22}.*/;
const spotifySongRegExp = /^https:\/\/open\.spotify\.com\/track\/(\w|-){22}.*/;

const play = async function (message, argv) {
  const args = argv.slice(2);
  if (args.length === 0 && message.attachments.size === 0) {
    message.channel.send({
      embed: { description: "I don't know what you want to play" },
    });
    return;
  }

  const spotifyListUrl = args.find((arg) => spotifyListRegExp.test(arg));
  if (spotifyListUrl) {
    try {
      const songs = await getTracks(spotifyListUrl);
      const urls = await Promise.all(
        songs.map(({ artists: [{ name: artist }], name: title }) =>
          this.player.search(`${artist} - ${title}`).then(([{ url }]) => url)
        )
      );
      this.player.playCustomPlaylist(message, urls);
    } catch (error) {
      message.channel.send({
        embed: { description: "I couldn't fetch the songs from that playlist" },
      });
    }

    return;
  }

  const spotifySongUrl = args.find((arg) => spotifySongRegExp.test(arg));
  if (spotifySongUrl) {
    try {
      const { artist, title } = await getPreview(spotifySongUrl);
      const [{ url }] = await this.player.search(`${artist} - ${title}`);
      this.player.play(message, url);
    } catch (error) {
      message.channel.send({
        embed: { description: "I couldn't fetch that song" },
      });
    }

    return;
  }

  const { attachments } = message;
  if (attachments.size > 0) {
    const { width, url } = attachments.values().next().value;
    if (width) {
      message.channel.send({
        embed: {
          description: "I can't play that because it's not a valid file format",
        },
      });
      return;
    }

    this.player.play(message, url);
    return;
  }

  this.player.play(message, args.join(" "));
};

module.exports = Object.assign(play, {
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena play** - Play music",
        },
        {
          name: "SYNOPSIS",
          value: "lena play (URL|QUERY|FILE)\nalias: p",
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

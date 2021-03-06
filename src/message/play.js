const ytsr = require("@distube/ytsr");
const { getData, getTracks } = require("spotify-url-info");
const selectSong = require("../select-song.js");

const spotifyListRegExp = /^https:\/\/open\.spotify\.com\/(playlist|artist|album)\/(\w|-){22}.*/;
const spotifySongRegExp = /^https:\/\/open\.spotify\.com\/track\/(\w|-){22}.*/;
const spotifyUrlRegExp = /^https:\/\/open\.spotify\.com\/(playlist|artist|album|track)\/(\w|-){22}.*/;

const retry = (f) => (...args) => f(...args).catch(() => f(...args));

const spotifyToYouTube = async (url) => {
  const songs = await (spotifyListRegExp.test(url)
    ? getTracks(url)
    : spotifySongRegExp.test(url)
    ? getData(url).then((data) => [data])
    : []);
  return Promise.all(
    songs.map(async (song) => {
      const query = `${song.artists[0].name} Topic - ${song.name}`;
      const result = await retry(ytsr)(query, { limit: 10 });
      return selectSong(result, song).url;
    })
  );
};

const play = async function (message, argv) {
  const args = argv.slice(2);
  if (args.length === 0 && message.attachments.size === 0) {
    return message.channel.send({
      embed: {
        title: "Error",
        description: "I don't know what you want to play",
      },
    });
  }

  const spotifyUrl = args.find((arg) => spotifyUrlRegExp.test(arg));
  if (spotifyUrl) {
    const urls = await spotifyToYouTube(spotifyUrl).catch(() => []);
    if (urls.length === 0) {
      return message.channel.send({
        embed: { title: "Error", description: "I can't fetch that" },
      });
    }

    if (urls.length === 1) {
      this.player.play(message, urls[0]);
      return null;
    }

    this.player.playCustomPlaylist(message, urls);
    return null;
  }

  const { attachments } = message;
  if (attachments.size > 0) {
    const { width, url } = attachments.values().next().value;
    if (width) {
      return message.channel.send({
        embed: {
          title: "Error",
          description: "I can't play that because it's not a valid file format",
        },
      });
    }

    this.player.play(message, url);
    return null;
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

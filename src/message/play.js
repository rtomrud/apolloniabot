const ytsr = require("@distube/ytsr");
const { getData } = require("spotify-url-info");
const selectSong = require("../select-song.js");

const spotifyUrlRegExp = /^https:\/\/open\.spotify\.com\/(playlist|artist|album|track)\/(\w|-){22}.*/;

const retry = (f) => (...args) => f(...args).catch(() => f(...args));

const findOnYouTube = async (song) => {
  const query = `${song.artists[0].name} Topic - ${song.name}`;
  const result = await retry(ytsr)(query, { limit: 10 });
  return selectSong(result, song).url;
};

const collectAttachmentUrls = async (message) =>
  new Promise((resolve) => {
    const collector = message.channel
      .createMessageCollector(
        ({ attachments }) =>
          attachments.size > 0 && !attachments.values().next().value.width,
        { time: 3000 }
      )
      .on("collect", () => collector.resetTimer())
      .on("end", (collected) =>
        resolve(
          collected.map(
            ({ attachments }) => attachments.values().next().value.url
          )
        )
      );
  });

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
    try {
      const data = await getData(spotifyUrl);
      const { name, tracks } = data;
      if (!tracks) {
        const url = await findOnYouTube(data);
        this.player.play(message, url);
      } else {
        const songs = !tracks.items
          ? tracks // artist
          : !tracks.items[0].track
          ? tracks.items // album
          : tracks.items.map(({ track }) => track); // playlist
        const urls = await Promise.all(songs.map(findOnYouTube));
        this.player.playCustomPlaylist(message, urls, {
          name,
          url: spotifyUrl,
        });
      }

      return null;
    } catch {
      return message.channel.send({
        embed: { title: "Error", description: "I can't fetch that" },
      });
    }
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

    const urls = await collectAttachmentUrls(message);
    if (urls.length > 0) {
      this.player.playCustomPlaylist(message, [url, ...urls]);
    } else {
      this.player.play(message, url);
    }

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

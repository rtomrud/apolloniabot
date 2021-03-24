const ytsr = require("@distube/ytsr");
const ms = require("ms");
const { getData } = require("spotify-url-info");
const logger = require("../logger.js");

const spotifyUrlRegExp = /^https:\/\/open\.spotify\.com\/(playlist|artist|album|track)\/(\w|-){22}.*/;

const retry = (f) => (...args) => f(...args).catch(() => f(...args));

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
      const songs = !tracks
        ? [data] // song
        : !tracks.items
        ? tracks // artist
        : !tracks.items[0].track
        ? tracks.items // album
        : tracks.items.map(({ track }) => track); // playlist
      const urls = await Promise.all(
        songs.map(async ({ artists, duration_ms, name }) => {
          const query = `${artists[0].name} Topic - ${name}`;
          const { items } = await retry(ytsr)(query, { limit: 10 });
          const songs = items.filter(({ type }) => type === "video");
          const title = name.toLowerCase();
          const artist = artists
            .map(({ name }) => name.toLowerCase())
            .join(" ");
          const song =
            songs.find(({ author, duration, isLive, name }) => {
              const video = name.toLowerCase();
              const channel = author.name.toLowerCase();
              return (
                !isLive &&
                Math.abs(duration_ms - ms(duration)) < 10000 &&
                ((video === title && channel === `${artist} - topic`) ||
                  (video.includes(title) &&
                    (channel === artist ||
                      author.ownerBadges.includes(
                        "Official Artist Channel"
                      ))) ||
                  (video.includes(`${artist} - ${title}`) &&
                    channel.includes(artist)))
              );
            }) ||
            songs.find(
              ({ duration, isLive, name }) =>
                !isLive &&
                name.toLowerCase().includes(title) &&
                Math.abs(duration_ms - ms(duration)) < 30000
            ) ||
            songs[0];
          return song.url;
        })
      );
      if (!tracks) {
        this.player.play(message, urls[0]);
        return null;
      }

      this.player.playCustomPlaylist(message, urls, { name, url: spotifyUrl });
      return null;
    } catch (error) {
      logger.error(error, message);
      return message.channel.send({
        embed: { title: "Error", description: "I could't fetch that" },
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

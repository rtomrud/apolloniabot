const ytsr = require("@distube/ytsr");
const { getTracks } = require("spotify-url-info");

const spotifyListMaxSongs = 1000;
const spotifyListRegExp = /^https:\/\/open\.spotify\.com\/(?:playlist\/|artist|album\/)(\w|-){22}.*/;

module.exports = async function (message, argv) {
  const args = argv.slice(2);
  if (args.length === 0) {
    message.channel.send({
      embed: { description: "I don't know what you want to play" },
    });
    return;
  }

  const spotifyList = args.find((arg) => spotifyListRegExp.test(arg));
  if (spotifyList) {
    const songs = await getTracks(spotifyList);
    if (songs.length > spotifyListMaxSongs) {
      message.channel.send({
        embed: {
          description: `I won't play Spotify playlists with more than ${spotifyListMaxSongs} tracks`,
        },
      });
      return;
    }

    const results = await Promise.all(
      songs.map(({ artists: [{ name: author }], name }) =>
        ytsr(`${author} - ${name}`, { limit: 1 }).catch(() => ({ items: [] }))
      )
    );
    // TODO: Add songs directly to the queue to avoid unnecessary refetches
    const urls = results.flatMap(({ items }) => items.map(({ url }) => url));
    this.player.playCustomPlaylist(message, urls);
    return;
  }

  this.player.play(message, args.join(" "));
};

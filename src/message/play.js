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

  const spotifyListUrl = args.find((arg) => spotifyListRegExp.test(arg));
  if (spotifyListUrl) {
    const spotifyList = await getTracks(spotifyListUrl);
    if (spotifyList.length > spotifyListMaxSongs) {
      message.channel.send({
        embed: {
          description: `I won't play Spotify playlists with more than ${spotifyListMaxSongs} tracks`,
        },
      });
      return;
    }

    try {
      const urls = await Promise.all(
        spotifyList.map(({ artists: [{ name: author }], name }) =>
          this.player.search(`${author} - ${name}`).then(([{ url }]) => url)
        )
      );
      this.player.playCustomPlaylist(message, urls);
      return;
    } catch (error) {
      message.channel.send({
        embed: { description: "I couldn't fetch the songs from that playlist" },
      });
      return;
    }
  }

  this.player.play(message, args.join(" "));
};

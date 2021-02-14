const { getTracks } = require("spotify-url-info");

const spotifyListRegExp = /^https:\/\/open\.spotify\.com\/(playlist|artist|album)\/(\w|-){22}.*/;

module.exports = async function (message, argv) {
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
        songs.map(({ artists: [{ name: author }], name }) =>
          this.player.search(`${author} - ${name}`).then(([{ url }]) => url)
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

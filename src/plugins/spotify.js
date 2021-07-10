const { CustomPlugin, Song, Playlist } = require("distube");
const { formatOpenURL, parse } = require("spotify-uri");
const { getData } = require("spotify-url-info");

module.exports = class extends CustomPlugin {
  constructor({
    parallel = true,
    supportedTypes = ["album", "artist", "playlist", "track"],
  } = {}) {
    super();
    this.parallel = parallel;
    this.supportedTypes = supportedTypes;
  }

  validate(url) {
    if (typeof url !== "string" || !url.includes("spotify")) {
      return false;
    }

    try {
      return this.supportedTypes.includes(parse(url).type);
    } catch {
      return false;
    }
  }

  async play(voiceChannel, url, member, textChannel, skip, unshift) {
    const options = { member, textChannel, skip, unshift };
    const data = await getData(url);
    if (data.type === "track") {
      const searchResult = await this.search(data);
      this.distube.playVoiceChannel(voiceChannel, searchResult, options);
      return;
    }

    const tracks =
      data.type === "album"
        ? data.tracks.items
        : data.type === "artist"
        ? data.tracks
        : data.type === "playlist"
        ? data.tracks.items.map(({ track }) => track)
        : [data];
    if (tracks.length > 0) {
      const searchResults = await (this.parallel
        ? Promise.all(tracks.map((track) => this.search(track)))
        : tracks.reduce(
            (p, track) => p.then(() => this.search(track)),
            Promise.resolve()
          ));
      const songs = searchResults
        .filter(Boolean)
        .map((searchResult) => new Song(searchResult));
      const playlist = new Playlist(songs, member);
      playlist.name = data.name;
      playlist.url = formatOpenURL(parse(url));
      this.distube.playVoiceChannel(voiceChannel, playlist, options);
    }
  }

  async search({ artists, name }) {
    const query = `${artists.map(({ name }) => name).join(" ")} ${name}`;
    try {
      const searchResults = await this.distube.search(query, { limit: 10 });
      return searchResults.find(
        (searchResult) => searchResult.type === "video" && !searchResult.isLive
      );
    } catch {
      return null;
    }
  }
};

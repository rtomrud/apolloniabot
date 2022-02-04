import { CustomPlugin, DisTubeError, Playlist, Song } from "distube";
import spotifyUri from "spotify-uri";
import { getTracks } from "spotify-url-info";

export default class SpotifyPlugin extends CustomPlugin {
  constructor({ pattern = "spotify" } = {}) {
    super();
    this.pattern = RegExp(pattern);
    this.searchQuery = (data) =>
      data.type === "track"
        ? `${data.artists.map(({ name }) => name).join(" ")} ${data.name}`
        : `${data.show.name} ${data.name}`;
  }

  async validate(url) {
    try {
      return this.pattern.test(url) && spotifyUri.parse(url).type != null;
    } catch {
      return false;
    }
  }

  async play(voiceChannel, url, options) {
    try {
      const tracks = await getTracks(url);
      if (tracks.length === 1) {
        const [track] = tracks;
        const results = await this.distube.search(this.searchQuery(track));
        this.distube.play(voiceChannel, results[0], options);
      } else {
        const searches = await Promise.all(
          tracks.map((track) =>
            this.distube.search(this.searchQuery(track)).catch(() => null)
          )
        );
        const songs = searches
          .filter((results) => results != null)
          .map((results) => new Song(results[0]));
        if (songs.length === 0) {
          throw new DisTubeError("NO_RESULT");
        }

        const playlist = new Playlist(songs, {
          properties: { url },
          metadata: { interaction: options.metadata.interaction },
        });
        this.distube.play(voiceChannel, playlist, options);
      }
    } catch (error) {
      this.distube.emitError(error, options.textChannel);
    }
  }
}

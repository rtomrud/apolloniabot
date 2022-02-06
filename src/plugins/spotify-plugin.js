import { CustomPlugin, DisTubeError, Playlist, Song } from "distube";
import spotifyUri from "spotify-uri";
import { getTracks } from "spotify-url-info";
import { search } from "youtube-search-without-api-key";

export default class SpotifyPlugin extends CustomPlugin {
  constructor({ pattern = "spotify" } = {}) {
    super();
    this.pattern = RegExp(pattern);
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
      const songs = await Promise.all(
        tracks.map(async (data) => {
          const query =
            data.type === "track"
              ? `${data.artists.map(({ name }) => name).join(" ")} ${data.name}`
              : `${data.show.name} ${data.name}`;
          const results = await search(query);
          const [result] = results;
          return new Song({
            id: result.id.videoId,
            url: result.url,
            name: result.title,
            duration: result.duration_raw,
            thumbnail: result.snippet.thumbnails.url,
            views: result.views,
          });
        })
      );
      if (songs.length === 1) {
        this.distube.play(voiceChannel, songs[0], options);
      } else {
        const playlist = new Playlist(songs, { properties: { url } });
        this.distube.play(voiceChannel, playlist, options);
      }
    } catch (error) {
      console.error(error);
      this.distube.emit(
        "error",
        options.textChannel,
        new DisTubeError("NO_RESULT")
      );
    }
  }
}

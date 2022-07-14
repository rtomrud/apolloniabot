import { DisTubeError, ExtractorPlugin, Playlist, Song } from "distube";
import fetch from "node-fetch";
import { parse } from "spotify-uri";
import spotifyUrlInfo from "spotify-url-info";
import { search } from "youtube-search-without-api-key";

const { getTracks } = spotifyUrlInfo(fetch);

export class SpotifyPlugin extends ExtractorPlugin {
  constructor({ regExp = /spotify/, spotifyUrlInfoOptions = {} } = {}) {
    super();
    this.regExp = regExp;
    this.spotifyUrlInfoOptions = spotifyUrlInfoOptions;
  }

  validate(url) {
    try {
      return this.regExp.test(url) && parse(url).type != null;
    } catch {
      return false;
    }
  }

  async resolve(url, { member, metadata }) {
    const options = { member, source: metadata.source, metadata };
    const tracks = await getTracks(url, this.spotifyUrlInfoOptions).catch(
      (error) => {
        throw new DisTubeError("SPOTIFY_PLUGIN_NO_RESULT", error);
      }
    );
    const songs = await Promise.all(
      tracks.map(async (data) => {
        const query = `${
          data.artists?.map(({ name }) => name).join(" ") ||
          data.podcast?.name ||
          data.showOrAudiobook?.name
        } ${data.name}`;
        const [result] = await search(query).catch((error) => {
          throw new DisTubeError("SPOTIFY_PLUGIN_NO_RESULT", error);
        });
        return new Song(
          {
            id: result.id.videoId,
            url: result.url,
            name: result.title,
            duration: result.duration_raw,
          },
          options
        );
      })
    );
    return songs.length > 1
      ? new Playlist(songs, { ...options, properties: { url } })
      : songs[0];
  }
}

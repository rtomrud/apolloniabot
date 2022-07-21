import {
  DisTubeError,
  ExtractorPlugin,
  Playlist,
  Song,
} from "../../node_modules/distube/dist/index.js";
import fetch from "node-fetch";
import { parse } from "spotify-uri";
import spotifyUrlInfo from "spotify-url-info";
import { search } from "scrape-youtube";

const { getTracks } = spotifyUrlInfo(fetch);

export class SpotifyPlugin extends ExtractorPlugin {
  constructor({
    regExp = /spotify/,
    searchOptions = { type: "video" },
    spotifyUrlInfoOptions = {},
  } = {}) {
    super();
    this.regExp = regExp;
    this.searchOptions = searchOptions;
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
        const results = await search(query, this.searchOptions).catch(
          (error) => {
            throw new DisTubeError("SPOTIFY_PLUGIN_NO_RESULT", error);
          }
        );
        const [video] = results.videos;
        return new Song(
          {
            id: video.id,
            url: video.link,
            name: video.title,
            duration: video.duration,
          },
          {
            member,
            source: metadata.source || "youtube",
            metadata,
          }
        );
      })
    );
    return songs.length > 1
      ? new Playlist(songs, { member, properties: { url }, metadata })
      : songs[0];
  }
}

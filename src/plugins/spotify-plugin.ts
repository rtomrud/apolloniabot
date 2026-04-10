import {
  DisTubeError,
  InfoExtractorPlugin,
  Playlist,
  ResolveOptions,
  Song,
} from "distube";
import spotifyUrlInfo from "spotify-url-info";
import { parse, formatOpenURL } from "spotify-uri";
import { fetch } from "undici";

import type { SpotifyUrlInfoModule } from "spotify-url-info";

const { getTracks } = (spotifyUrlInfo as SpotifyUrlInfoModule)(fetch);

export class SpotifyPlugin extends InfoExtractorPlugin {
  regExp: RegExp;

  constructor({
    regExp = /^https?:\/\/(open|play)\.spotify\.com\/(?<type>album|artist|episode|playlist|show|track)\/(?<id>[a-zA-Z0-9]+)\??.*$/,
  } = {}) {
    super();
    this.regExp = regExp;
  }

  override validate(url: string): boolean {
    return this.regExp.test(url);
  }

  override async resolve<T>(
    url: string,
    options: ResolveOptions<T>,
  ): Promise<Song<T> | Playlist<T>> {
    const tracks = await getTracks(url).catch((error: Error) => {
      throw new DisTubeError(
        "SPOTIFY_API_ERROR",
        `${error.name}: ${error.message}`,
      );
    });
    const songs = tracks.map((track) => {
      const parsedSpotifyUri = parse(track.uri);
      return new Song(
        {
          plugin: this,
          source: "spotify",
          playFromSource: false,
          id: parsedSpotifyUri.id,
          name: `${track.name} - ${track.artist}`,
          uploader: {
            name: track.artist,
          },
          url: formatOpenURL(parsedSpotifyUri),
          duration: (track.duration || 0) / 1000,
        },
        options,
      );
    });
    return songs.length > 1
      ? new Playlist({ source: "spotify", url, songs }, options)
      : songs[0];
  }

  override createSearchQuery<T>(song: Song<T>): string {
    return `${song.name} ${song.uploader.name}`;
  }

  override getRelatedSongs(): Song[] {
    return [];
  }
}

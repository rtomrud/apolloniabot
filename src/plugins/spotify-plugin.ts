import {
  DisTubeError,
  InfoExtractorPlugin,
  Playlist,
  ResolveOptions,
  Song,
} from "distube";
// @ts-expect-error No typings
import spotifyUrlInfo from "spotify-url-info";

import { parse, formatOpenURL } from "spotify-uri";
import { fetch } from "undici";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const { getTracks } = spotifyUrlInfo(fetch) as {
  getTracks: (url: string) => Promise<
    Array<{
      artist: string;
      duration: number;
      name: string;
      uri: string;
    }>
  >;
};

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
      throw new DisTubeError("SPOTIFY_PLUGIN_NO_RESULT", String(error));
    });
    const songs = tracks.map((track) => {
      const parsedSpotifyUri = parse(track.uri);
      return new Song(
        {
          plugin: this,
          source: "spotify",
          playFromSource: false,
          id: parsedSpotifyUri.id,
          name: track.name,
          uploader: {
            name: track.artist,
          },
          url: formatOpenURL(parsedSpotifyUri),
          duration: track.duration / 1000,
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

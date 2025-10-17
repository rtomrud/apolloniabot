import {
  DisTubeError,
  InfoExtractorPlugin,
  Playlist,
  ResolveOptions,
  Song,
} from "distube";
import durationToSeconds from "duration-to-seconds";
import { parse } from "node-html-parser";

const songRegExp =
  /^https?:\/\/music\.apple\.com\/.+?\/(song|album)\/.+?(\/.+?\?i=|\/)(\d+)$/;
const albumRegExp = /^https?:\/\/music\.apple\.com\/.+?\/album\/.+\/(\d+)$/;

export class AppleMusicPlugin extends InfoExtractorPlugin {
  regExp: RegExp;

  constructor({
    regExp = /^https?:\/\/music\.apple\.com\/.+?\/(song|album)\/.+$/,
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
    const appleMusicSongs = await this.getSongs(url).catch((error: Error) => {
      throw new DisTubeError(
        "APPLE_MUSIC_API_ERROR",
        `${error.name}: ${error.message}`,
      );
    });
    const songs = appleMusicSongs.map((song) => {
      return new Song(
        {
          plugin: this,
          source: "apple music",
          playFromSource: false,
          id: song.url || "",
          name: `${song.name} - ${song.artist}`,
          uploader: {
            name: song.artist,
          },
          url: song.url,
          duration: song.duration,
        },
        options,
      );
    });
    return songs.length > 1
      ? new Playlist({ source: "apple music", url, songs }, options)
      : songs[0];
  }

  override createSearchQuery<T>(song: Song<T>): string {
    return `${song.name} ${song.uploader.name}`;
  }

  override getRelatedSongs(): Song[] {
    return [];
  }

  private async getSongs(url: string) {
    const response = await fetch(url);
    const data = await response.text();
    const root = parse(data);
    const script = root.querySelector('script[type="application/ld+json"]');
    const json = script?.textContent || "{}";

    if (albumRegExp.test(url)) {
      const schema = JSON.parse(json) as {
        tracks: [
          {
            name: string;
            duration: string;
            url: string;
          },
        ];
        byArtist: [{ name: string }];
      };
      const artist = schema?.byArtist.map(({ name }) => name).join(", ");
      return schema?.tracks.map(({ name, duration, url }) => ({
        artist,
        duration: durationToSeconds(duration),
        name,
        url,
      }));
    }

    if (songRegExp.test(url)) {
      const schema = JSON.parse(json) as {
        audio: {
          name: string;
          url: string;
          duration: string;
          byArtist: [{ name: string }];
        };
      };
      return [
        {
          artist: schema?.audio?.byArtist.map(({ name }) => name).join(", "),
          duration: durationToSeconds(schema?.audio?.duration),
          name: schema?.audio?.name,
          url,
        },
      ];
    }

    return [];
  }
}

import { GuildMember } from "discord.js";
import { DisTubeError, ExtractorPlugin, Playlist, Song } from "distube";
import fetch from "node-fetch";
import { parse } from "spotify-uri";
import spotifyUrlInfo from "spotify-url-info";
import { SearchOptions, search } from "scrape-youtube";

type SpotifyData =
  | {
      type: "episode";
      title: string;
      subtitle: string;
    }
  | {
      type: "track";
      title: string;
      artists: { name: string }[];
    }
  | {
      type: "artist" | "playlist";
      trackList: {
        title: string;
        subtitle: string;
      }[];
    };

const spotify = spotifyUrlInfo(fetch);

const getTracks = async (url: string, options?: object) => {
  const data = (await spotify.getData(url, options)) as SpotifyData;
  switch (data.type) {
    case "track":
      return [
        {
          title: data.title,
          subtitle: data.artists.map(({ name }) => name).join(" "),
        },
      ];
    case "episode":
      return [{ title: data.title, subtitle: data.subtitle }];
    case "playlist":
    case "artist":
    default:
      return data.trackList;
  }
};

export class SpotifyPlugin extends ExtractorPlugin {
  regExp: RegExp;

  searchOptions: SearchOptions;

  constructor({
    regExp = /spotify/,
    searchOptions = { type: "video" } as SearchOptions,
  } = {}) {
    super();
    this.regExp = regExp;
    this.searchOptions = searchOptions;
  }

  override validate(url: string) {
    try {
      return this.regExp.test(url) && Boolean(parse(url).type);
    } catch {
      return false;
    }
  }

  override async resolve<T>(
    url: string,
    { member, metadata }: { member?: GuildMember; metadata?: T }
  ) {
    const tracks = await getTracks(url).catch((error: Error) => {
      throw new DisTubeError("SPOTIFY_PLUGIN_NO_RESULT", String(error));
    });
    const songs = await Promise.all(
      tracks.map(async (track) => {
        const query = `${track.title} ${track.subtitle}`;
        const results = await search(query, this.searchOptions).catch(
          (error: Error) => {
            throw new DisTubeError("SPOTIFY_PLUGIN_NO_RESULT", String(error));
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
          { member, source: "youtube (spotify)", metadata }
        );
      })
    );
    return songs.length > 1
      ? new Playlist(songs, { member, properties: { url }, metadata })
      : songs[0];
  }
}

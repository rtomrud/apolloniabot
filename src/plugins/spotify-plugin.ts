import { GuildMember } from "discord.js";
import {
  DisTubeError,
  ExtractorPlugin,
  OtherSongInfo,
  Playlist,
  Song,
} from "distube";
import { findOne, textContent } from "domutils";
import { parseDocument } from "htmlparser2";
import fetch from "node-fetch";
import { SearchOptions, search } from "scrape-youtube";

export class SpotifyPlugin extends ExtractorPlugin {
  regExp: RegExp;

  searchOptions: SearchOptions;

  constructor({
    regExp = /^https?:\/\/(open|play)\.spotify\.com\/(?<type>album|artist|episode|playlist|show|track)\/(?<id>[a-zA-Z0-9]+)\??.*$/,
    searchOptions = { type: "video" } as SearchOptions,
  } = {}) {
    super();
    this.regExp = regExp;
    this.searchOptions = searchOptions;
  }

  override validate(url: string) {
    return this.regExp.test(url);
  }

  override async resolve<T>(
    url: string,
    { member, metadata }: { member?: GuildMember; metadata?: T }
  ) {
    const tracks = await SpotifyPlugin.getTracks(url).catch((error: Error) => {
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
        const songInfo = {
          id: video.id,
          url: video.link,
          name: video.title,
          duration: video.duration,
        } as OtherSongInfo;
        return new Song(songInfo, {
          member,
          source: "youtube (spotify)",
          metadata,
        });
      })
    );
    return songs.length > 1
      ? new Playlist(songs, { member, properties: { url }, metadata })
      : songs[0];
  }

  static async getTracks(url: string) {
    const [, type, id] = new URL(url).pathname.split("/");
    const embedUrl = `https://embed.spotify.com/?uri=spotify:${type}:${id}`;
    const response = await fetch(embedUrl);
    const text = await response.text();
    const node = findOne(
      (elem) => elem.type === "script" && elem.attribs.id === "initial-state",
      parseDocument(text).children
    );
    if (!node) {
      return [];
    }

    const metadata = JSON.parse(
      Buffer.from(textContent(node), "base64").toString()
    ) as {
      data: {
        entity:
          | { type: "episode"; title: string; subtitle: string }
          | { type: "track"; title: string; artists: { name: string }[] }
          | {
              type: "artist" | "playlist";
              trackList: { title: string; subtitle: string }[];
            };
      };
    };
    const { entity } = metadata.data;
    switch (entity.type) {
      case "track":
        return [
          {
            title: entity.title,
            subtitle: entity.artists.map(({ name }) => name).join(" "),
          },
        ];
      case "episode":
        return [{ title: entity.title, subtitle: entity.subtitle }];
      case "playlist":
      case "artist":
      default:
        return entity.trackList;
    }
  }
}

import { GuildMember } from "discord.js";
import { DisTubeError, ExtractorPlugin, Playlist, Song } from "distube";
import fetch from "node-fetch";
import { parse } from "spotify-uri";
import spotifyUrlInfo, { Tracks } from "spotify-url-info";
import { SearchOptions, search } from "scrape-youtube";

const spotify = spotifyUrlInfo(fetch);

interface Track extends Tracks {
  podcast?: { name: string };
  showOrAudiobook?: { name: string };
}

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
    const tracks = await spotify.getTracks(url).catch((error: Error) => {
      throw new DisTubeError("SPOTIFY_PLUGIN_NO_RESULT", String(error));
    });
    const songs = await Promise.all(
      tracks.map(async (track: Track) => {
        const query = `${
          track.artists?.map(({ name }) => name).join(" ") ||
          track.podcast?.name ||
          track.showOrAudiobook?.name ||
          ""
        } ${track.name}`;
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

import { VoiceBasedChannel } from "discord.js";
import {
  CustomPlugin,
  DisTubeError,
  OtherSongInfo,
  PlayOptions,
  Song,
} from "distube";
import { SearchOptions, search } from "scrape-youtube";

export class YouTubeSearchPlugin extends CustomPlugin {
  searchOptions: SearchOptions;

  separator: string | RegExp;

  constructor({
    searchOptions = { type: "video" } as SearchOptions,
    separator = " " as string | RegExp,
  } = {}) {
    super();
    this.searchOptions = searchOptions;
    this.separator = separator;
  }

  override validate(string: string) {
    try {
      const [url] = string.split(this.separator);
      return !new URL(url).protocol.startsWith("http");
    } catch {
      return true;
    }
  }

  override async play(
    voiceChannel: VoiceBasedChannel,
    song: string,
    options: PlayOptions
  ) {
    const results = await search(song, this.searchOptions).catch(() => {
      throw new DisTubeError("NO_RESULT");
    });
    const [video] = results.videos;
    const songInfo = {
      id: video.id,
      url: video.link,
      name: video.title,
      duration: video.duration,
    } as OtherSongInfo;
    const resolvedSong = new Song(songInfo, {
      member: options.member,
      source: "youtube (youtube-search)",
      metadata: options.metadata as unknown,
    });
    return this.distube.play(voiceChannel, resolvedSong, options);
  }
}

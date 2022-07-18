import {
  CustomPlugin,
  DisTubeError,
  Song,
} from "../../node_modules/distube/dist/index.js";
import { search } from "youtube-search-without-api-key";

export class YouTubeSearchPlugin extends CustomPlugin {
  constructor({ separator = " " } = {}) {
    super();
    this.separator = separator;
  }

  validate(song) {
    try {
      const [url] = song.split(this.separator);
      return !new URL(url).protocol.startsWith("http");
    } catch {
      return true;
    }
  }

  async play(voiceChannel, query, options) {
    let song;
    try {
      const [result] = await search(query);
      song = new Song(
        {
          id: result.id.videoId,
          url: result.url,
          name: result.title,
          duration: result.duration_raw,
        },
        {
          member: options.member,
          source: options.metadata.source || "youtube",
          metadata: options.metadata,
        }
      );
    } catch (error) {
      throw new DisTubeError("NO_RESULT", error);
    }

    return this.distube.play(voiceChannel, song, options);
  }
}

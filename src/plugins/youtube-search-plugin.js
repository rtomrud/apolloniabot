import {
  CustomPlugin,
  DisTubeError,
  Song,
} from "../../node_modules/distube/dist/index.js";
import { search } from "scrape-youtube";

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
    const results = await search(query, { type: "video" }).catch((error) => {
      throw new DisTubeError("NO_RESULT", error);
    });
    const [video] = results.videos;
    const song = new Song(
      {
        id: video.id,
        url: video.link,
        name: video.title,
        duration: video.duration,
      },
      {
        member: options.member,
        source: options.metadata.source || "youtube",
        metadata: options.metadata,
      }
    );
    return this.distube.play(voiceChannel, song, options);
  }
}

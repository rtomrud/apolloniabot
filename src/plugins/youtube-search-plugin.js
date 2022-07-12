import { CustomPlugin, DisTubeError, Song } from "distube";
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
    try {
      const [result] = await search(query);
      const song = new Song(
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
      this.distube.play(voiceChannel, song, options);
    } catch (error) {
      this.emitError(new DisTubeError("NO_RESULT", error), options.textChannel);
    }
  }
}

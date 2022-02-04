import { ExtractorPlugin, Playlist, Song } from "distube";
import { create } from "youtube-dl-exec";

export default class YoutubeDlPlugin extends ExtractorPlugin {
  constructor({
    binaryPath = "./node_modules/youtube-dl-exec/bin/yt-dlp",
    pattern,
  } = {}) {
    super();
    this.youtubeDlExec = create(binaryPath);
    this.pattern = RegExp(pattern);
  }

  async validate(url) {
    return this.pattern.test(url);
  }

  async getStreamURL(url) {
    const response = await this.youtubeDlExec(url, {
      dumpSingleJson: true,
      noWarnings: true,
    });
    return response.url;
  }

  async resolve(url, { member, metadata }) {
    const response = await this.youtubeDlExec(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
    });
    if (Array.isArray(response.entries) && response.entries.length > 0) {
      response.songs = response.entries.map(
        (entry) =>
          new Song(entry, { member, source: entry.extractor, metadata })
      );
      return new Playlist(response, {
        member,
        properties: { source: response.songs[0]?.source },
        metadata,
      });
    }

    return new Song(response, { member, source: response.extractor, metadata });
  }
}

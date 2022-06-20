import { DisTubeError, ExtractorPlugin, Playlist, Song } from "distube";
import youtubeDlExec, { create } from "youtube-dl-exec";

export class YtDlpPlugin extends ExtractorPlugin {
  constructor({ binaryPath = "yt-dlp" } = {}) {
    super();
    this.youtubeDlExec = null;
    create(binaryPath)("", { version: true }).then(
      () => {
        this.youtubeDlExec = create(binaryPath);
      },
      () =>
        youtubeDlExec("", { version: true }).then(() => {
          this.youtubeDlExec = youtubeDlExec;
        })
    );
  }

  async validate() {
    return Boolean(this.youtubeDlExec);
  }

  async getStreamURL(url) {
    const response = await this.youtubeDlExec(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
    });
    return response.url;
  }

  async resolve(url, { member, metadata }) {
    const response = await this.youtubeDlExec(url, {
      dumpSingleJson: true,
      noWarnings: true,
      preferFreeFormats: true,
    }).catch(async (e) => {
      // Send a follup now because throwing here doesn't trigger the error event
      await metadata.interaction.fetchReply();
      metadata.interaction
        .followUp({ embeds: [{ description: "Error: I can't play that" }] })
        .catch(console.error);
      throw new DisTubeError("YTDLP_ERROR", e);
    });
    if (Array.isArray(response.entries) && response.entries.length > 0) {
      return new Playlist(
        {
          ...response,
          songs: response.entries.map(
            (entry) =>
              new Song(entry, { member, source: entry.extractor, metadata })
          ),
          source: response.extractor,
        },
        { member, metadata }
      );
    }

    return new Song(response, { member, source: response.extractor, metadata });
  }
}

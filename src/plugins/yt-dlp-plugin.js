import child_process from "child_process";
import { promisify } from "util";
import { DisTubeError, ExtractorPlugin, Playlist, Song } from "distube";

const execFile = promisify(child_process.execFile);

export class YtDlpPlugin extends ExtractorPlugin {
  constructor({ binaryPath = "yt-dlp" } = {}) {
    super();
    this.binaryPath = binaryPath;
  }

  async validate() {
    return Boolean(this.binaryPath);
  }

  async getStreamURL(url) {
    const { stdout } = await execFile(
      this.binaryPath,
      [url, "--dump-single-json", "--no-warnings", "--prefer-free-formats"],
      { windowsHide: true }
    );
    const info = JSON.parse(stdout);
    return info.url;
  }

  async resolve(url, { member, metadata }) {
    const { stdout } = await execFile(
      this.binaryPath,
      [url, "--dump-single-json", "--no-warnings", "--prefer-free-formats"],
      { windowsHide: true }
    ).catch(async ({ stderr }) => {
      // Send a follup now because throwing here doesn't trigger the error event
      await metadata.interaction.fetchReply();
      metadata.interaction
        .followUp({ embeds: [{ description: "Error: I can't play that" }] })
        .catch(console.error);
      throw new DisTubeError("YTDLP_ERROR", stderr);
    });
    const info = JSON.parse(stdout);
    if (Array.isArray(info.entries) && info.entries.length > 0) {
      return new Playlist(
        {
          ...info,
          songs: info.entries.map(
            (entry) =>
              new Song(entry, { member, source: entry.extractor, metadata })
          ),
          source: info.extractor,
        },
        { member, metadata }
      );
    }

    return new Song(info, { member, source: info.extractor, metadata });
  }
}

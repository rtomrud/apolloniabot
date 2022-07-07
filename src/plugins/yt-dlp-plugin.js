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
      [
        url,
        "--format=ba[acodec=opus]/ba/b[acodec=opus]/b",
        "--dump-single-json",
        "--no-warnings",
        "--prefer-free-formats",
      ],
      { windowsHide: true }
    ).catch((error) => {
      throw new DisTubeError("YTDLP_ERROR", error.stderr || error);
    });
    const info = JSON.parse(stdout);
    return info.url;
  }

  async resolve(url, { member, metadata }) {
    const { stdout } = await execFile(
      this.binaryPath,
      [url, "--dump-single-json", "--no-warnings", "--prefer-free-formats"],
      { windowsHide: true }
    ).catch(async (error) => {
      throw new DisTubeError("YTDLP_ERROR", error.stderr || error);
    });
    const info = JSON.parse(stdout);
    return Array.isArray(info.entries)
      ? new Playlist(
          info.entries.map(
            (entry) =>
              new Song(entry, { member, source: entry.extractor, metadata })
          ),
          { member, properties: { url: info.url }, metadata }
        )
      : new Song(info, { member, source: info.extractor, metadata });
  }
}

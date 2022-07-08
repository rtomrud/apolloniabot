import child_process from "child_process";
import { promisify } from "util";
import { DisTubeError, ExtractorPlugin, Playlist, Song } from "distube";

const execFile = promisify(child_process.execFile);

const cache = new Map();
const timeouts = new Map();

export class YtDlpPlugin extends ExtractorPlugin {
  constructor({ binaryPath = "yt-dlp" } = {}) {
    super();
    this.binaryPath = binaryPath;
  }

  validate(url) {
    try {
      return this.binaryPath && new URL(url).protocol.startsWith("http");
    } catch {
      return false;
    }
  }

  async getStreamURL(url) {
    if (cache.has(url)) {
      return cache.get(url);
    }

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
      [
        url,
        "--format=ba[acodec=opus]/ba/b[acodec=opus]/b",
        "--dump-single-json",
        "--no-warnings",
        "--prefer-free-formats",
        ...(/^https?:\/\/(((www|music|m)\.youtube\.com)|youtu\.be)/.test(url)
          ? ["--flat-playlist"]
          : []),
      ],
      { windowsHide: true }
    ).catch(async (error) => {
      throw new DisTubeError("YTDLP_ERROR", error.stderr || error);
    });
    const info = JSON.parse(stdout);
    if (info.url) {
      cache.set(url, info.url);
      const timeout = setTimeout(() => cache.delete(url), 60000);
      clearTimeout(timeouts.get(url));
      timeouts.set(url, timeout);
    }

    const options = {
      member,
      source: metadata.source || info.extractor,
      metadata,
    };
    return Array.isArray(info.entries)
      ? new Playlist(
          info.entries.map((entry) => new Song(entry, options)),
          { ...options, properties: { url } }
        )
      : new Song(info, options);
  }
}

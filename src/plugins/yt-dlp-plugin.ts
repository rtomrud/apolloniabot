import { ExecFileOptions, execFile as execFileCallback } from "child_process";
import { promisify } from "util";
import { GuildMember } from "discord.js";
import {
  DisTubeError,
  ExtractorPlugin,
  OtherSongInfo,
  Playlist,
  Song,
} from "distube";

interface YtDlpInfo {
  entries?: OtherSongInfo[];
  extractor: string;
  url: string;
}

const execFile = promisify(execFileCallback);

const cache: Map<string, string> = new Map();
const timeouts: Map<string, NodeJS.Timeout> = new Map();

export class YtDlpPlugin extends ExtractorPlugin {
  binaryPath: string;

  execFileOptions: ExecFileOptions;

  constructor({
    binaryPath = "yt-dlp",
    execFileOptions = {
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 10,
    } as ExecFileOptions,
  } = {}) {
    super();
    this.binaryPath = binaryPath;
    this.execFileOptions = execFileOptions;
  }

  override validate(url: string) {
    try {
      return (
        Boolean(this.binaryPath) && new URL(url).protocol.startsWith("http")
      );
    } catch {
      return false;
    }
  }

  override async getStreamURL(url: string) {
    const cachedUrl = cache.get(url);
    if (cachedUrl) {
      return cachedUrl;
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
      this.execFileOptions
    ).catch(({ stdout, stderr }: { stdout: string; stderr: string }) => {
      throw new DisTubeError("YTDLP_ERROR", stderr || stdout);
    });
    const info = JSON.parse(stdout) as { url: string };
    if (!info.url) {
      throw new DisTubeError("YTDLP_ERROR", `Can't get stream URL of "${url}"`);
    }

    return info.url;
  }

  override async resolve<T>(
    url: string,
    { member, metadata }: { member?: GuildMember; metadata?: T }
  ) {
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
      this.execFileOptions
    ).catch(({ stdout, stderr }: { stdout: string; stderr: string }) => {
      throw new DisTubeError("YTDLP_ERROR", stderr || stdout);
    });
    const info = JSON.parse(stdout) as YtDlpInfo;
    if (info.url) {
      cache.set(url, info.url);
      const timeout = setTimeout(() => cache.delete(url), 60000);
      clearTimeout(timeouts.get(url));
      timeouts.set(url, timeout);
    }

    const source = `${info.extractor} (yt-dlp)`;
    return Array.isArray(info.entries)
      ? new Playlist(
          info.entries.map(
            (entry) => new Song(entry, { member, source, metadata })
          ),
          { member, properties: { url }, metadata }
        )
      : new Song(info, { member, source, metadata });
  }
}

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

const execFile = promisify(execFileCallback);

const cache: Map<string, string> = new Map();
const timeouts: Map<string, NodeJS.Timeout> = new Map();

export class YtDlpPlugin extends ExtractorPlugin {
  regExp: RegExp;

  binaryPath: string;

  constructor({ regExp = /.+/, binaryPath = "yt-dlp" } = {}) {
    super();
    this.regExp = regExp;
    this.binaryPath = binaryPath;
  }

  override validate(url: string) {
    return Boolean(this.binaryPath) && this.regExp.test(url);
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
      { windowsHide: true, maxBuffer: 1024 * 1024 * 10 }
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
        "--default-search=auto",
        "--dump-single-json",
        "--no-warnings",
        "--prefer-free-formats",
        ...(/^https?:\/\/(((www|music|m)\.youtube\.com)|youtu\.be)/.test(url)
          ? ["--flat-playlist"]
          : []),
      ],
      { windowsHide: true, maxBuffer: 1024 * 1024 * 10 }
    ).catch(({ stdout, stderr }: { stdout: string; stderr: string }) => {
      throw new DisTubeError("YTDLP_ERROR", stderr || stdout);
    });
    const info = JSON.parse(stdout) as {
      entries?: OtherSongInfo[];
      extractor: string;
      src?: string;
      url: string;
    };
    const source = `${info.extractor} (yt-dlp)`;
    if (info.entries && !info.extractor.includes("search")) {
      return new Playlist(
        info.entries.map(
          (entry) => new Song(entry, { member, source, metadata })
        ),
        { member, properties: { url }, metadata }
      );
    }

    const songInfo = info.entries ? info.entries[0] : info;
    if (songInfo.url) {
      cache.set(url, songInfo.url);
      const timeout = setTimeout(() => cache.delete(url), 60000);
      clearTimeout(timeouts.get(url));
      timeouts.set(url, timeout);
    }

    return new Song(songInfo as OtherSongInfo, { member, source, metadata });
  }
}

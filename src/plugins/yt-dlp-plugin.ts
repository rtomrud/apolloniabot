import { execFile as execFileCallback } from "child_process";
import { promisify } from "util";
import {
  DisTubeError,
  ExtractorPlugin,
  Playlist,
  ResolveOptions,
  Song,
} from "distube";
import youtubeSr from "youtube-sr";

const { default: yt } = youtubeSr;

type YtDlpVideo = {
  id: string;
  duration: number;
  extractor: string;
  is_live: boolean;
  original_url: string;
  title: string;
  webpage_url: string;
};

type YtDlpPlaylist = {
  entries: YtDlpVideo[];
  extractor: string;
  url: string;
};

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

  override validate(url: string): boolean {
    return this.regExp.test(url);
  }

  override async resolve<T>(
    url: string,
    options: ResolveOptions<T>,
  ): Promise<Song<T> | Playlist<T>> {
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
      { windowsHide: true, maxBuffer: 1024 * 1024 * 10 },
    ).catch(({ stdout, stderr }: { stdout: string; stderr: string }) => {
      throw new DisTubeError("YTDLP_ERROR", stderr || stdout);
    });
    const info = JSON.parse(stdout) as YtDlpPlaylist;
    if (Array.isArray(info.entries) && !info.extractor.includes("search")) {
      return new Playlist(
        {
          source: info.extractor,
          songs: info.entries.map(
            (ytDlpVideo) =>
              new Song(
                {
                  plugin: this,
                  source: ytDlpVideo.extractor,
                  playFromSource: true,
                  id: ytDlpVideo.id,
                  name: ytDlpVideo.title,
                  url: ytDlpVideo.webpage_url || ytDlpVideo.original_url,
                  isLive: ytDlpVideo.is_live,
                  duration: ytDlpVideo.is_live ? 0 : ytDlpVideo.duration,
                },
                options,
              ),
          ),
        },
        options,
      );
    }

    const ytDlpVideo = (
      Array.isArray(info.entries) ? info.entries[0] : info
    ) as YtDlpVideo;
    const song = new Song(
      {
        plugin: this,
        source: ytDlpVideo.extractor,
        playFromSource: true,
        id: ytDlpVideo.id,
        name: ytDlpVideo.title,
        url: ytDlpVideo.webpage_url || ytDlpVideo.original_url,
        isLive: ytDlpVideo.is_live,
        duration: ytDlpVideo.is_live ? 0 : ytDlpVideo.duration,
      },
      options,
    );

    if (song.url && info.url) {
      cache.set(song.url, info.url);
      const timeout = setTimeout(() => cache.delete(song.url || ""), 60000);
      clearTimeout(timeouts.get(song.url));
      timeouts.set(song.url, timeout);
    }

    return song;
  }

  override async searchSong<T>(
    query: string,
    options: ResolveOptions<T>,
  ): Promise<Song<T> | null> {
    const videos = await yt.search(query, { type: "video", limit: 1 });
    if (videos.length == 0) {
      return null;
    }

    const [video] = videos;
    return new Song(
      {
        plugin: this,
        source: "youtube",
        playFromSource: true,
        id: video.id || "",
        name: video.title || "",
        url: video.url,
        isLive: video.live,
        duration: video.duration,
      },
      options,
    );
  }

  override async getStreamURL<T>(song: Song<T>): Promise<string> {
    const cachedUrl = cache.get(song.url || "");
    if (cachedUrl) {
      return cachedUrl;
    }

    const { stdout } = await execFile(
      this.binaryPath,
      [
        song.url || "",
        "--format=ba[acodec=opus]/ba/b[acodec=opus]/b",
        "--dump-single-json",
        "--no-warnings",
        "--prefer-free-formats",
      ],
      { windowsHide: true, maxBuffer: 1024 * 1024 * 10 },
    ).catch(({ stdout, stderr }: { stdout: string; stderr: string }) => {
      throw new DisTubeError("YTDLP_ERROR", stderr || stdout);
    });
    const info = JSON.parse(stdout) as { url: string };
    if (!info.url) {
      throw new DisTubeError(
        "YTDLP_ERROR",
        `Can't get stream URL of "${song.url}"`,
      );
    }

    return info.url;
  }

  override getRelatedSongs(): Song[] {
    return [];
  }
}

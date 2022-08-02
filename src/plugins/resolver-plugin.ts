import { VoiceBasedChannel } from "discord.js";
import { CustomPlugin, PlayOptions } from "distube";

export class ResolverPlugin extends CustomPlugin {
  separator: string | RegExp;

  constructor({ separator = " " as string | RegExp } = {}) {
    super();
    this.separator = separator;
  }

  override validate(string: string) {
    try {
      const [url] = string.split(this.separator);
      return new URL(url).protocol.startsWith("http");
    } catch {
      return false;
    }
  }

  override async play(
    voiceChannel: VoiceBasedChannel,
    song: string,
    options: PlayOptions
  ) {
    const plugin = this.distube.extractorPlugins.find((plugin) =>
      plugin.validate(song)
    );
    const resolvedSong = plugin ? await plugin.resolve(song, options) : song;
    return this.distube.play(voiceChannel, resolvedSong, options);
  }
}

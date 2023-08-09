import { VoiceBasedChannel } from "discord.js";
import { CustomPlugin, PlayOptions } from "distube";

export class ResolverPlugin extends CustomPlugin {
  regExp: RegExp;

  constructor({ regExp = /.+/ } = {}) {
    super();
    this.regExp = regExp;
  }

  override validate(string: string) {
    return this.regExp.test(string);
  }

  override async play(
    voiceChannel: VoiceBasedChannel,
    song: string,
    options: PlayOptions,
  ) {
    const plugin = this.distube.extractorPlugins.find((plugin) =>
      plugin.validate(song),
    );
    const resolvedSong = plugin ? await plugin.resolve(song, options) : song;
    return this.distube.play(voiceChannel, resolvedSong, options);
  }
}

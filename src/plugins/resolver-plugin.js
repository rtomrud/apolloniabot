import { CustomPlugin } from "distube";

export class ResolverPlugin extends CustomPlugin {
  constructor({ separator = " " } = {}) {
    super();
    this.separator = separator;
  }

  validate(song) {
    try {
      const [url] = song.split(this.separator);
      return new URL(url).protocol.startsWith("http");
    } catch {
      return false;
    }
  }

  async play(voiceChannel, url, options) {
    const plugin = this.distube.extractorPlugins.find((plugin) =>
      plugin.validate(url)
    );
    if (plugin) {
      const resolvedURL = await plugin.resolve(url, options);
      this.distube.play(voiceChannel, resolvedURL, options);
    } else {
      // Fallback to default resolve
      this.distube.play(voiceChannel, url, options);
    }
  }
}

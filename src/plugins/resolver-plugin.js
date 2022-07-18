import { CustomPlugin } from "../../node_modules/distube/dist/index.js";

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
    if (!plugin) {
      // Fallback to default resolve
      return this.distube.play(voiceChannel, url, options);
    }

    const resolvedURL = await plugin.resolve(url, options);
    return this.distube.play(voiceChannel, resolvedURL, options);
  }
}

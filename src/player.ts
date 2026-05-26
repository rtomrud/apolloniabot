import { DisTube } from "distube";
import { AppleMusicPlugin } from "./plugins/apple-music-plugin.ts";
import { SpotifyPlugin } from "./plugins/spotify-plugin.ts";
import { YtDlpPlugin } from "./plugins/yt-dlp-plugin.ts";
import client from "./client.ts";

const player: DisTube = new DisTube(client, {
  plugins: [new AppleMusicPlugin(), new SpotifyPlugin(), new YtDlpPlugin()],
  savePreviousSongs: false,
  customFilters: {
    0.5: "atempo=0.5",
    0.75: "atempo=0.75",
    1.25: "atempo=1.25",
    1.5: "atempo=1.5",
    1.75: "atempo=1.75",
    2: "atempo=2.0",
  },
  nsfw: true,
});

export default player;

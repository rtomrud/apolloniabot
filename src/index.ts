import "dotenv/config";
import { Client } from "discord.js";
import { DisTube as Player } from "distube";
import playerEvents from "./events/player/index.js";
import events from "./events/index.js";
import { ResolverPlugin } from "./plugins/resolver-plugin.js";
import { SpotifyPlugin } from "./plugins/spotify-plugin.js";
import { YouTubeSearchPlugin } from "./plugins/youtube-search-plugin.js";
import { YtDlpPlugin } from "./plugins/yt-dlp-plugin.js";
import intents from "./intents.js";

const client = new Client({
  intents,
  shards: "auto",
}) as Client & { player: Player };

const player = new Player(client, {
  plugins: [
    new ResolverPlugin(),
    new YouTubeSearchPlugin(),
    new SpotifyPlugin(),
    new YtDlpPlugin(),
  ],
  leaveOnFinish: true,
  savePreviousSongs: false,
  nsfw: true,
});

client.player = player;

Object.values(playerEvents).forEach(({ event, listener }) => {
  player.on(event, listener);
});

Object.values(events).forEach(({ event, listener }) => {
  client.on(event as string, listener);
});

client.login(process.env.TOKEN).catch(console.error);

export default client;

import "dotenv/config";
import { Client, GatewayIntentBits } from "discord.js";
import { DisTube as Player } from "distube";
import playerEvents from "./events/player/index.js";
import events from "./events/index.js";
import { ResolverPlugin } from "./plugins/resolver-plugin.js";
import { SpotifyPlugin } from "./plugins/spotify-plugin.js";
import { YtDlpPlugin } from "./plugins/yt-dlp-plugin.js";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  shards: "auto",
}) as Client & { player: Player };

const player = new Player(client, {
  plugins: [new ResolverPlugin(), new SpotifyPlugin(), new YtDlpPlugin()],
  leaveOnFinish: true,
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

client.player = player;

Object.values(playerEvents).forEach(({ event, listener }) => {
  player.on(event, listener);
});

Object.values(events).forEach(({ event, listener }) => {
  client.on(event as string, listener);
});

client.login(process.env.TOKEN).catch(console.error);

export default client;

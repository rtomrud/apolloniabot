import "dotenv/config";
import { Client } from "discord.js";
import { DisTube as Player } from "distube";
import events from "./events/index.js";
import playerEvents from "./events/player/index.js";
import intents from "./intents.js";
import SpotifyPlugin from "./plugins/spotify-plugin.js";
import YoutubeDlPlugin from "./plugins/youtube-dl-plugin.js";

const client = new Client({ intents });

const player = new Player(client, {
  plugins: [new YoutubeDlPlugin(), new SpotifyPlugin()],
  emitNewSongOnly: true,
  leaveOnFinish: true,
  savePreviousSongs: false,
  youtubeDL: false,
  nsfw: true,
});

client.player = player;

Object.values(events).forEach((event) => client.on(event.name, event));
Object.values(playerEvents).forEach((event) => player.on(event.name, event));

client.login(process.env.TOKEN);

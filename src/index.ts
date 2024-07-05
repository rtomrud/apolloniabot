import "dotenv/config";
import events from "./events/index.js";
import playerEvents from "./events/player/index.js";
import client from "./client.js";
import player from "./player.js";

Object.values(events).forEach(({ event, listener }) => {
  client.on(event as string, listener);
});

Object.values(playerEvents).forEach(({ event, listener }) => {
  player.on(event, listener);
});

client.login(process.env.TOKEN).catch(console.error);

export default { client, player };

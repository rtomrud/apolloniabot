import events from "./events/index.ts";
import playerEvents from "./events/player/index.ts";
import client from "./client.ts";
import player from "./player.ts";

Object.values(events).forEach(({ event, listener }) => {
  client.on(event as string, listener);
});

Object.values(playerEvents).forEach(({ event, listener }) => {
  player.on(event, listener);
});

client.login(Deno.env.get("TOKEN")).catch(console.error);

export default { client, player };

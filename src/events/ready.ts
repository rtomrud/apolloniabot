import { Client, Events } from "discord.js";

export const event = Events.ClientReady;

export const listener = function (this: Client, client: Client<true>) {
  console.log(
    JSON.stringify({
      event: "READY",
      date: client.readyAt.toISOString(),
    }),
  );
};

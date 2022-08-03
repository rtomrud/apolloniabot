import { Client, Events } from "discord.js";
import commands from "../commands/index.js";

export const event = Events.ClientReady;

export const listener = async function (this: Client, client: Client<true>) {
  console.log(
    JSON.stringify({
      event: "READY",
      date: client.readyAt.toISOString(),
    })
  );

  await client.application.commands
    .set(Object.values(commands).map(({ data }) => data.toJSON()))
    .catch(console.error);
};

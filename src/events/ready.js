import { Client } from "discord.js";
import commands from "../commands/index.js";

export default async function ready(client = new Client()) {
  console.log(
    "%s (%s) ready on %s",
    client.user.tag,
    client.user.toString(),
    client.readyAt.toUTCString()
  );

  await client.application.commands
    .set(
      Object.values(commands).map(({ data }) => data),
      process.env.GUILD_ID
    )
    .catch(console.error);
}

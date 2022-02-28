import { Client } from "discord.js";
import commands from "../commands/index.js";

export default async function ready(client = new Client()) {
  console.log(
    JSON.stringify({
      event: "READY",
      user: client.user.tag,
      userId: client.user.id,
      readyAt: client.readyAt.toISOString(),
    })
  );

  await client.application.commands
    .set(
      Object.values(commands).map(({ data }) => data),
      process.env.GUILD_ID
    )
    .catch(console.error);
}

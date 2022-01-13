import { Client } from "discord.js";
import commands from "../commands/index.js";
import permissions from "../permissions.js";
import scopes from "../scopes.js";

export default async function ready(client = new Client()) {
  console.log(
    "%s (%s) ready at %s on %s",
    client.user.tag,
    client.user.toString(),
    client.generateInvite({ permissions, scopes }),
    client.readyAt.toUTCString()
  );
  if (!client.application.owner) {
    await client.application.fetch();
  }

  await client.application.commands
    .set(
      Object.values(commands).map(({ data }) => data),
      process.env.GUILD_ID // If defined, set commands only for this guild
    )
    .catch(({ message }) => console.error(message));
}

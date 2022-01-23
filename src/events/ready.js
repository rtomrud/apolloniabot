import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v8";
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

  const rest = new REST({ version: "8" }).setToken(process.env.TOKEN);
  const route = process.env.GUILD_ID
    ? Routes.applicationGuildCommands(
        client.application.id,
        process.env.GUILD_ID
      )
    : Routes.applicationCommands(client.application.id);
  await rest
    .put(route, { body: Object.values(commands).map(({ data }) => data) })
    .catch(console.error);
}

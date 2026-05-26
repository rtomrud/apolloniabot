import { REST, Routes } from "discord.js";
import commands from "../src/commands/index.ts";

new REST()
  .setToken(Deno.env.get("TOKEN") ?? "")
  .put(Routes.applicationCommands(Deno.env.get("CLIENT_ID") ?? ""), {
    body: Object.values(commands).map(({ data }) => data.toJSON()),
  })
  .then(() => console.log("Successfully deployed all application commands."))
  .catch(console.error);

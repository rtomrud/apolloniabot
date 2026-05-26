import { REST, Routes } from "discord.js";

new REST()
  .setToken(Deno.env.get("TOKEN") ?? "")
  .put(Routes.applicationCommands(Deno.env.get("CLIENT_ID") ?? ""), {
    body: [],
  })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);

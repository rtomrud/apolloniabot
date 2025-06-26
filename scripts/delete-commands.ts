import "dotenv/config";
import { REST, Routes } from "discord.js";

new REST()
  .setToken(process.env.TOKEN || "")
  .put(Routes.applicationCommands(process.env.CLIENT_ID || ""), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);

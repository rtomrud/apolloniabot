import "dotenv/config";
import { REST, Routes } from "discord.js";

const rest = new REST().setToken(process.env.TOKEN || "");

rest
  .put(Routes.applicationCommands(process.env.CLIENT_ID || ""), { body: [] })
  .then(() => console.log("Successfully deleted all application commands."))
  .catch(console.error);

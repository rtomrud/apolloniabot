import "dotenv/config";
import { REST, Routes } from "discord.js";
import commands from "../src/commands/index.js";

new REST()
  .setToken(process.env.TOKEN || "")
  .put(Routes.applicationCommands(process.env.CLIENT_ID || ""), {
    body: Object.values(commands).map(({ data }) => data.toJSON()),
  })
  .then(() => console.log("Successfully deployed all application commands."))
  .catch(console.error);

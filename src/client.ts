import { Client, GatewayIntentBits } from "discord.js";

export default new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  shards: "auto",
});

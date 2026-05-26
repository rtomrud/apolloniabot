import { Client, GatewayIntentBits } from "discord.js";

const client: Client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
  shards: "auto",
});

export default client;

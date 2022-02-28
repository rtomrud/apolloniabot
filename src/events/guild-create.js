import { Guild } from "discord.js";

export default function guildCreate(guild = new Guild()) {
  console.log(
    JSON.stringify({
      event: "GUILD_CREATE",
      guild: guild.name,
      guildId: guild.id,
      joinedAt: guild.joinedAt.toISOString(),
    })
  );
}

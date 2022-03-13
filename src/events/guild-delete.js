import { Guild } from "discord.js";

export default function guildDelete(guild = new Guild()) {
  if (!guild.available) {
    return;
  }

  console.log(
    JSON.stringify({
      event: "GUILD_DELETE",
      guild: guild.name,
      guildId: guild.id,
      joinedAt: guild.joinedAt.toISOString(),
    })
  );
}

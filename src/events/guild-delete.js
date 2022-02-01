import { Guild } from "discord.js";

export default function guildDelete(guild = new Guild()) {
  if (!guild.available) {
    return;
  }

  console.log(
    "%s (%s) left %s (%s) on %s",
    guild.client.user.tag,
    guild.client.user.toString(),
    guild.name,
    guild.id,
    guild.joinedAt.toUTCString()
  );
}

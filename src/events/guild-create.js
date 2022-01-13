import { Guild } from "discord.js";

export default function guildCreate(guild = new Guild()) {
  console.log(
    "%s (%s) joined %s (%s) on %s",
    guild.client.user.tag,
    guild.client.user.toString(),
    guild.name,
    guild.id,
    guild.joinedAt.toUTCString()
  );
}

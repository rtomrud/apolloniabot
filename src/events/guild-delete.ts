import { Events, Guild } from "discord.js";

export const event = Events.GuildDelete;

export const listener = function (guild: Guild) {
  if (!guild.available) {
    return;
  }

  console.log(
    JSON.stringify({
      event: "GUILD_DELETE",
      guild: guild.name,
      guildId: guild.id,
      date: guild.joinedAt.toISOString(),
    }),
  );
};

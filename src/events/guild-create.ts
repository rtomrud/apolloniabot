import { Events, Guild } from "discord.js";

export const event = Events.GuildCreate;

export const listener = function (guild: Guild) {
  console.log(
    JSON.stringify({
      event: "GUILD_CREATE",
      guild: guild.name,
      guildId: guild.id,
      date: guild.joinedAt.toISOString(),
    })
  );
};

import { GuildTextBasedChannel } from "discord.js";
import { Events } from "distube";

export const event = Events.ERROR;

export const listener = function (
  _channel: GuildTextBasedChannel | undefined,
  error: Error,
) {
  console.error(error);
};

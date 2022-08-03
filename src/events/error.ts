import { Events } from "discord.js";

export const event = Events.Error;

export const listener = function (error: Error) {
  console.error(error);
};

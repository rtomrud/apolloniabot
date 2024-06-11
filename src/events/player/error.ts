import { Events } from "distube";

export const event = Events.ERROR;

export const listener = function (error: Error) {
  console.error(error);
};

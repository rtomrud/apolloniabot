import * as error from "./error.ts";
import * as guildCreate from "./guild-create.ts";
import * as guildDelete from "./guild-delete.ts";
import * as interactionCreate from "./interaction-create.ts";
import * as ready from "./ready.ts";
import * as voiceStateUpdate from "./voice-state-update.ts";

export default {
  error,
  guildCreate,
  guildDelete,
  interactionCreate,
  ready,
  voiceStateUpdate,
};

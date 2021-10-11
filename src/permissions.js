import { Permissions } from "discord.js";

// The minimum permissions needed by the bot
const permissions = new Permissions([
  Permissions.FLAGS.CONNECT,
  Permissions.FLAGS.EMBED_LINKS,
  Permissions.FLAGS.SEND_MESSAGES,
  Permissions.FLAGS.SPEAK,
  Permissions.FLAGS.USE_APPLICATION_COMMANDS,
]);

export default permissions.bitfield;

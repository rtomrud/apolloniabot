"use strict";

const { Permissions } = require("discord.js");

const { bitfield } = new Permissions([
  Permissions.FLAGS.CONNECT,
  Permissions.FLAGS.EMBED_LINKS,
  Permissions.FLAGS.SEND_MESSAGES,
  Permissions.FLAGS.SPEAK,
  Permissions.FLAGS.USE_APPLICATION_COMMANDS,
]);

module.exports = function (clientId, permissions = bitfield) {
  return `https://discord.com/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot%20applications.commands`;
};

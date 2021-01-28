require("dotenv").config();
const { Player } = require("discord-player");
const { Client } = require("discord.js");
const message = require("./message/index.js");
const botDisconnect = require("./bot-disconnect.js");
const channelEmpty = require("./channel-empty.js");
const noResults = require("./no-results.js");
const playlistAdd = require("./playlist-add.js");
const queueEnd = require("./queue-end.js");
const ready = require("./ready.js");
const searchInvalidResponse = require("./search-invalid-response.js");
const searchResults = require("./search-results.js");
const trackAdd = require("./track-add.js");
const trackStart = require("./track-start.js");
const error = require("./error.js");

const client = new Client();

client.player = new Player(client, {
  autoSelfDeaf: false,
  leaveOnEndCooldown: 5,
})
  .on("botDisconnect", botDisconnect)
  .on("channelEmpty", channelEmpty)
  .on("noResults", noResults)
  .on("playlistAdd", playlistAdd)
  .on("queueEnd", queueEnd)
  .on("searchInvalidResponse", searchInvalidResponse)
  .on("searchResults", searchResults)
  .on("trackAdd", trackAdd)
  .on("trackStart", trackStart)
  .on("error", error);

client
  .on("message", message)
  .on("error", console.error)
  .once("ready", ready)
  .login(process.env.TOKEN);

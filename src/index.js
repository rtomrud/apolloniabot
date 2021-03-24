require("dotenv").config();
const { Client } = require("discord.js");
const DisTube = require("distube");
const message = require("./message/index.js");
const addList = require("./player/add-list.js");
const addSong = require("./player/add-song.js");
const empty = require("./player/empty.js");
const error = require("./player/error.js");
const finish = require("./player/finish.js");
const initQueue = require("./player/init-queue.js");
const noRelated = require("./player/no-related.js");
const playList = require("./player/play-list.js");
const playSong = require("./player/play-song.js");
const guildCreate = require("./guild-create.js");
const guildDelete = require("./guild-delete.js");
const logMessages = require("./log-messages.js");
const logger = require("./logger.js");
const ready = require("./ready.js");

const client = new Client({
  presence: { activity: { name: "lena", type: "LISTENING" } },
});

client.player = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  customFilters: {
    0.25: "atempo=0.25",
    0.5: "atempo=0.5",
    0.75: "atempo=0.75",
    1.25: "atempo=1.25",
    1.5: "atempo=1.5",
    1.75: "atempo=1.75",
    2: "atempo=2.0",
  },
})
  .on("addList", logMessages(addList))
  .on("addSong", logMessages(addSong))
  .on("empty", logMessages(empty))
  .on("error", logMessages(error))
  .on("finish", logMessages(finish))
  .on("initQueue", logMessages(initQueue))
  .on("noRelated", logMessages(noRelated))
  .on("playList", logMessages(playList))
  .on("playSong", logMessages(playSong));

client
  .on("message", logMessages(message))
  .on("error", logger.error)
  .on("guildCreate", logMessages(guildCreate))
  .on("guildDelete", logMessages(guildDelete))
  .once("ready", logMessages(ready))
  .login(process.env.TOKEN);

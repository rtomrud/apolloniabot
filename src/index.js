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
const logError = require("./log-error.js");
const ready = require("./ready.js");
const withLog = require("./with-log.js");

const client = new Client({
  presence: { activity: { name: "lena", type: "LISTENING" } },
});

client.player = new DisTube(client, {
  emitNewSongOnly: true,
  updateYouTubeDL: false,
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
  .on("addList", withLog(addList))
  .on("addSong", withLog(addSong))
  .on("empty", withLog(empty))
  .on("error", withLog(error))
  .on("finish", withLog(finish))
  .on("initQueue", withLog(initQueue))
  .on("noRelated", withLog(noRelated))
  .on("playList", withLog(playList))
  .on("playSong", withLog(playSong));

client
  .on("message", withLog(message))
  .on("error", logError)
  .on("guildCreate", withLog(guildCreate))
  .on("guildDelete", withLog(guildDelete))
  .once("ready", withLog(ready))
  .login(process.env.TOKEN);

require("dotenv").config();
const { Client } = require("discord.js");
const DisTube = require("distube");
const message = require("./message/index.js");
const addList = require("./player/add-list.js");
const addSong = require("./player/add-song.js");
const empty = require("./player/empty.js");
const playerError = require("./player/error.js");
const finish = require("./player/finish.js");
const initQueue = require("./player/init-queue.js");
const noRelated = require("./player/no-related.js");
const playList = require("./player/play-list.js");
const playSong = require("./player/play-song.js");
const error = require("./error.js");
const guildCreate = require("./guild-create.js");
const guildDelete = require("./guild-delete.js");
const log = require("./log.js");
const ready = require("./ready.js");

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
  .on("addList", log(addList))
  .on("addSong", log(addSong))
  .on("empty", log(empty))
  .on("error", log(playerError))
  .on("finish", log(finish))
  .on("initQueue", log(initQueue))
  .on("noRelated", log(noRelated))
  .on("playList", log(playList))
  .on("playSong", log(playSong));

client
  .on("message", log(message))
  .on("error", log(error))
  .on("guildCreate", log(guildCreate))
  .on("guildDelete", log(guildDelete))
  .once("ready", log(ready))
  .login(process.env.TOKEN);

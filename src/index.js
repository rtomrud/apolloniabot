require("dotenv").config();
const { homedir } = require("os");
const { mkdirSync } = require("fs");
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
const store = require("./store/index.js");
const error = require("./error.js");
const guildCreate = require("./guild-create.js");
const guildDelete = require("./guild-delete.js");
const ready = require("./ready.js");

const db = `${homedir()}/.lenabot/`;
mkdirSync(db, { recursive: true });

const client = new Client({
  presence: { activity: { name: "lena", type: "LISTENING" } },
});

client.storage = store(db);

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
  .on("addList", addList)
  .on("addSong", addSong)
  .on("empty", empty)
  .on("error", playerError)
  .on("finish", finish)
  .on("initQueue", initQueue)
  .on("noRelated", noRelated)
  .on("playList", playList)
  .on("playSong", playSong);

client
  .on("message", message)
  .on("error", error)
  .on("guildCreate", guildCreate)
  .on("guildDelete", guildDelete)
  .once("ready", ready)
  .login(process.env.TOKEN);

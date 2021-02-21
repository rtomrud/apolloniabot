require("dotenv").config();
const { Client } = require("discord.js");
const DisTube = require("distube");
const message = require("./message/index.js");
const addList = require("./add-list.js");
const addSong = require("./add-song.js");
const empty = require("./empty.js");
const error = require("./error.js");
const finish = require("./finish.js");
const guildCreate = require("./guild-create.js");
const initQueue = require("./init-queue.js");
const noRelated = require("./no-related.js");
const playList = require("./play-list.js");
const playSong = require("./play-song.js");
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
  .on("addList", addList)
  .on("addSong", addSong)
  .on("empty", empty)
  .on("error", error)
  .on("finish", finish)
  .on("initQueue", initQueue)
  .on("noRelated", noRelated)
  .on("playList", playList)
  .on("playSong", playSong);

client
  .on("message", message)
  .on("guildCreate", guildCreate)
  .on("error", console.error)
  .once("ready", ready)
  .login(process.env.TOKEN);

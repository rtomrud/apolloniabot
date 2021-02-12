require("dotenv").config();
const { Client } = require("discord.js");
const DisTube = require("distube");
const message = require("./message/index.js");
const addList = require("./add-list.js");
const addSong = require("./add-song.js");
const empty = require("./empty.js");
const error = require("./error.js");
const finish = require("./finish.js");
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
})
  .on("addList", addList)
  .on("addSong", addSong)
  .on("empty", empty)
  .on("error", error)
  .on("finish", finish)
  .on("noRelated", noRelated)
  .on("playList", playList)
  .on("playSong", playSong);

client
  .on("message", message)
  .on("error", console.error)
  .once("ready", ready)
  .login(process.env.TOKEN);

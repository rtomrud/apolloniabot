require("dotenv").config();
const { Client } = require("discord.js");
const DisTube = require("distube");
const message = require("./message/index.js");
const addList = require("./add-list.js");
const addSong = require("./add-song.js");
const empty = require("./empty.js");
const error = require("./error.js");
const finish = require("./finish.js");
const playSong = require("./play-song.js");
const playList = require("./play-list.js");
const ready = require("./ready.js");

const client = new Client({
  presence: { activity: { name: "lena", type: "LISTENING" } },
});

client.player = new DisTube(client, {
  autoSelfDeaf: false,
  leaveOnFinish: true,
})
  .on("addList", addList)
  .on("addSong", addSong)
  .on("empty", empty)
  .on("error", error)
  .on("finish", finish)
  .on("playList", playList)
  .on("playSong", playSong);

client
  .on("message", message)
  .on("error", console.error)
  .once("ready", ready)
  .login(process.env.TOKEN);

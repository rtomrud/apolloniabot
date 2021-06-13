require("dotenv").config();
const { Client } = require("discord.js");
const DisTube = require("distube");
const message = require("./message/index.js");
const formatPlaylist = require("./format-playlist.js");
const formatSong = require("./format-song.js");
const guildCreate = require("./guild-create.js");
const guildDelete = require("./guild-delete.js");
const logMessages = require("./log-messages.js");
const logger = require("./logger.js");
const ready = require("./ready.js");

const client = new Client({
  presence: { activity: { name: "lena", type: "LISTENING" } },
});

const logMessage = (messages) =>
  Array.isArray(messages) ? messages.forEach(logger.log) : logger.log(messages);

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
  .on("addList", (message, queue, playlist) =>
    message.channel
      .send({
        embed: { title: "Queued", description: formatPlaylist(playlist) },
      })
      .then(logMessage)
  )
  .on("addSong", (message, queue, song) =>
    message.channel
      .send({
        embed: { title: "Queued", description: formatSong(song) },
      })
      .then(logMessage)
  )
  .on("empty", (message) =>
    message.channel
      .send({
        embed: { title: "Stopped", description: "The voice channel is empty" },
      })
      .then(logMessage)
  )
  .on("error", (message, err) => {
    const description = err.message.endsWith(
      "User is not in the voice channel."
    )
      ? "I can't join you because you're not in a voice channel"
      : err.message.endsWith(
          "You do not have permission to join this voice channel."
        )
      ? "I don't have permission to join your voice channel"
      : err.message.endsWith("No result!")
      ? "I can't find anything, check your URL or query"
      : err.message.includes("youtube-dl")
      ? "I can't play that URL"
      : "";
    if (!description) {
      client.emit("error", err);
    }

    message.channel
      .send({
        embed: {
          title: "Error",
          description: description || "I can't do that, sorry",
        },
      })
      .then(logMessage);
  })
  .on("finish", (message) =>
    message.channel
      .send({
        embed: { title: "Stopped", description: "The queue is finished" },
      })
      .then(logMessage)
  )
  .on("initQueue", (queue) => {
    queue.autoplay = false;
  })
  .on("noRelated", (message) =>
    message.channel
      .send({
        embed: {
          title: "Stopped",
          description: "The queue is finished and I can't autoplay anything",
        },
      })
      .then(logMessage)
  )
  .on("playList", (message, queue, playlist) =>
    message.channel
      .send({
        embed: { title: "Playing", description: formatPlaylist(playlist) },
      })
      .then(logMessage)
  )
  .on("playSong", (message, queue, song) =>
    message.channel
      .send({
        embed: {
          title: client.user === song.user ? "Autoplaying" : "Playing",
          description: formatSong(song),
        },
      })
      .then(logMessage)
  );

client
  .on("message", logMessages(message))
  .on("error", logger.error)
  .on("guildCreate", guildCreate)
  .on("guildDelete", guildDelete)
  .once("ready", ready)
  .login(process.env.TOKEN);

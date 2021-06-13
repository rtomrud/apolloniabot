require("dotenv").config();
const { Client, Permissions } = require("discord.js");
const DisTube = require("distube");
const alias = require("./message/alias.js");
const formatPlaylist = require("./format-playlist.js");
const formatSong = require("./format-song.js");
const logMessage = require("./log-message.js");

const prefix = process.env.PREFIX || "lena";
const id = process.env.CLIENT_ID;
const prefixRegExp = RegExp(`^(?:${prefix}|<@!?${id}>)`, "i");
const {
  FLAGS: { SEND_MESSAGES, EMBED_LINKS, PRIORITY_SPEAKER },
} = Permissions;
const permissions = SEND_MESSAGES + EMBED_LINKS;
const separatorRegExp = /\s+/;

const client = new Client({
  presence: { activity: { name: "lena", type: "LISTENING" } },
});

const player = new DisTube(client, {
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

client.player = player;

client
  .on("guildCreate", ({ available, systemChannel }) => {
    if (available && systemChannel) {
      systemChannel
        .send({
          embed: {
            title: "Hi!",
            description: `I play music. Type \`${prefix} help\` to find out what I can do for you.`,
          },
        })
        .then(logMessage);
    }
  })
  .on("error", console.error)
  .on("message", (message) => {
    const { author, channel, content, member } = message;
    if (!prefixRegExp.test(content)) {
      return null;
    }

    logMessage(message);
    if (!channel.permissionsFor(client.user).has(permissions)) {
      return author
        .send({
          embed: {
            title: "Error",
            description: `I don't have the Send Messages and Embed Links permissions in <#${channel.id}>`,
          },
        })
        .then(logMessage);
    }

    const argv = content.split(separatorRegExp);
    const handle = alias(argv);
    if (!handle) {
      return message
        .reply({
          embed: {
            title: "Error",
            description: `I don't know what you want, try \`${prefix} help\``,
          },
        })
        .then(logMessage);
    }

    const queue = player.getQueue(message);
    const isUnauthroized =
      queue &&
      queue.dj &&
      !handle.safe &&
      !member.permissions.has(PRIORITY_SPEAKER);
    if (isUnauthroized) {
      return message
        .reply({
          title: "Error",
          description:
            "You can't do that because **DJ** mode is on and you don't have the Priority Speaker permission",
        })
        .then(logMessage);
    }

    return handle.bind(client)(message, argv, alias).then(logMessage);
  })
  .once("ready", () => console.log(client.readyAt.toISOString(), "READY"))
  .login(process.env.TOKEN);

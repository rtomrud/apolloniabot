require("dotenv").config();
const { Client, Permissions } = require("discord.js");
const DisTube = require("distube");
const SpotifyPlugin = require("@distube/spotify");
const commands = require("./commands/index.js");
const formatSong = require("./format-song.js");

const prefix = process.env.PREFIX || "lena";
const id = process.env.CLIENT_ID;
const prefixRegExp = RegExp(`^(?:${prefix}|<@!?${id}>)`, "i");
const {
  FLAGS: { SEND_MESSAGES, EMBED_LINKS },
} = Permissions;
const permissions = SEND_MESSAGES + EMBED_LINKS;
const separatorRegExp = /\s+/;

const client = new Client({
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
  presence: { activity: { name: "lena", type: "LISTENING" } },
});

const player = new DisTube(client, {
  plugins: [new SpotifyPlugin({ parallel: true })],
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  savePreviousSongs: false,
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
  .on("addList", (queue, { formattedDuration, name, songs: { length }, url }) =>
    queue.textChannel.send({
      embed: {
        title: "Queued",
        description: `[${name}](${url}) (${length} track${
          length === 1 ? "" : "s"
        }) [${formattedDuration}]`,
      },
    })
  )
  .on("addSong", (queue, song) =>
    queue.textChannel.send({
      embed: { title: "Queued", description: formatSong(song) },
    })
  )
  .on("empty", (queue) =>
    queue.textChannel.send({
      embed: { title: "Stopped", description: "The voice channel is empty" },
    })
  )
  .on("error", (channel, error) => {
    const description = error.message.endsWith(
      "User is not in any voice channel."
    )
      ? "I can't join you because you're not in a voice channel"
      : error.message.endsWith(
          "You do not have permission to join this voice channel."
        )
      ? "I don't have permission to join your voice channel"
      : error.message.endsWith("No result!")
      ? "I can't find anything, check your URL or query"
      : error.message.includes("youtube-dl")
      ? "I can't play that URL"
      : "";
    if (!description) {
      client.emit("error", error);
    }

    channel.send({
      embed: {
        title: "Error",
        description: description || "I can't do that, sorry",
      },
    });
  })
  .on("finish", (queue) =>
    queue.textChannel.send({
      embed: { title: "Stopped", description: "The queue is finished" },
    })
  )
  .on("initQueue", (queue) => {
    queue.autoplay = false;
  })
  .on("noRelated", (queue) =>
    queue.textChannel.send({
      embed: {
        title: "Stopped",
        description: "The queue is finished and I can't autoplay anything",
      },
    })
  )
  .on("playSong", (queue, song) =>
    queue.textChannel.send({
      embed: {
        title: client.user === song.user ? "Autoplaying" : "Playing",
        description: formatSong(song),
      },
    })
  );

client.player = player;

client
  .on("guildCreate", ({ available, systemChannel }) => {
    if (available && systemChannel) {
      systemChannel.send({
        embed: {
          title: "Hi!",
          description: `I play music. Type \`${prefix} help\` to find out what I can do for you.`,
        },
      });
    }
  })
  .on("error", console.error)
  .on("message", (message) => {
    if (!prefixRegExp.test(message.content)) {
      return;
    }

    const {
      attachments,
      author,
      channel,
      content,
      createdAt,
      guild,
      id,
      member,
    } = message;
    console.log(
      createdAt.toISOString(),
      author.id,
      guild ? `/${guild.id}/${channel.id}/${id}` : `/${channel.id}/${id}`,
      JSON.stringify((member && member.nickname) || author.username),
      JSON.stringify(
        `${content}${
          attachments.size > 0
            ? `\n${attachments.values().next().value.url}\n`
            : ""
        }`
      )
    );

    if (!channel.permissionsFor(client.user).has(permissions)) {
      author.send({
        embed: {
          title: "Error",
          description: `I don't have the Send Messages and Embed Links permissions in <#${channel.id}>`,
        },
      });
      return;
    }

    const argv = content.split(separatorRegExp);
    const command = commands(argv);
    if (!command) {
      message.reply({
        embed: {
          title: "Error",
          description: `I don't know what you want, try \`${prefix} help\``,
        },
      });
      return;
    }

    command.bind(client)(message, argv, commands);
  })
  .once("ready", () => console.log(client.readyAt.toISOString(), "READY"))
  .login(process.env.TOKEN);

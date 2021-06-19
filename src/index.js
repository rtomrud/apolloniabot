require("dotenv").config();
const { Client, Permissions } = require("discord.js");
const { DisTube } = require("distube");
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
  allowedMentions: { parse: ["users"] },
  intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_VOICE_STATES"],
  presence: { activity: { name: "lena", type: "LISTENING" } },
});

const distube = new DisTube(client, {
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
});

distube.on(
  "addList",
  ({ textChannel }, { formattedDuration, name, songs: { length }, url }) =>
    textChannel.send({
      embeds: [
        {
          title: "Queued",
          description: `[${name}](${url}) (${length} track${
            length === 1 ? "" : "s"
          }) [${formattedDuration}]`,
        },
      ],
    })
);

distube.on("addSong", ({ textChannel }, song) =>
  textChannel.send({
    embeds: [{ title: "Queued", description: formatSong(song) }],
  })
);

distube.on("empty", ({ textChannel }) =>
  textChannel.send({
    embeds: [{ title: "Stopped", description: "The voice channel is empty" }],
  })
);

distube.on("error", (channel, error) => {
  const description = error.message.endsWith(
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
    embeds: [
      { title: "Error", description: description || "I can't do that, sorry" },
    ],
  });
});

distube.on("finish", ({ textChannel }) =>
  textChannel.send({
    embeds: [{ title: "Stopped", description: "The queue is finished" }],
  })
);

distube.on("initQueue", (queue) => {
  queue.autoplay = false;
});

distube.on("noRelated", ({ textChannel }) =>
  textChannel.send({
    embeds: [
      {
        title: "Stopped",
        description: "The queue is finished and I can't autoplay anything",
      },
    ],
  })
);

distube.on("playSong", ({ textChannel }, song) =>
  textChannel.send({
    embeds: [
      {
        title: client.user === song.user ? "Autoplaying" : "Playing",
        description: formatSong(song),
      },
    ],
  })
);

client.on("guildCreate", ({ available, systemChannel }) => {
  if (available && systemChannel) {
    systemChannel.send({
      embeds: [
        {
          title: "Hi!",
          description: `I play music. Type \`${prefix} help\` to find out what I can do for you.`,
        },
      ],
    });
  }
});

client.on("error", console.error);

client.on("message", (message) => {
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
      embeds: [
        {
          title: "Error",
          description: `I don't have the Send Messages and Embed Links permissions in <#${channel.id}>`,
        },
      ],
    });
    return;
  }

  const argv = content.split(separatorRegExp);
  const command = commands(argv);
  if (!command) {
    message.reply({
      embeds: [
        {
          title: "Error",
          description: `I don't know what you want, try \`${prefix} help\``,
        },
      ],
    });
    return;
  }

  command(distube, message, argv, commands);
});

client.once("ready", () => console.log(client.readyAt.toISOString(), "READY"));

client.login(process.env.TOKEN);

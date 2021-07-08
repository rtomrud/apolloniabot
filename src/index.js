require("dotenv").config();
const SpotifyPlugin = require("@distube/spotify");
const { Client } = require("discord.js");
const { default: DisTube } = require("distube");
const commands = require("./commands/index.js");
const formatSong = require("./format-song.js");

const client = new Client({
  allowedMentions: { parse: ["users"] },
  intents: ["GUILDS", "GUILD_VOICE_STATES"],
  presence: { activity: { name: "/help", type: "LISTENING" } },
});

const distube = new DisTube(client, {
  plugins: [new SpotifyPlugin({ parallel: true })],
  emitNewSongOnly: true,
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: true,
  savePreviousSongs: false,
});

distube.on("addList", (queue, playlist) =>
  queue.textChannel.send({
    embeds: [
      {
        description: `Queued [${playlist.name}](${playlist.url}) (${
          playlist.songs.length
        } track${playlist.songs.length === 1 ? "" : "s"}) [${
          playlist.formattedDuration
        }]`,
      },
    ],
  })
);

distube.on("addSong", (queue, song) =>
  queue.textChannel.send({
    embeds: [{ description: `Queued ${formatSong(song)}` }],
  })
);

distube.on("empty", (queue) =>
  queue.textChannel.send({
    embeds: [{ description: "Stopped because the voice channel is empty" }],
  })
);

distube.on("error", (channel, error) => {
  const description = error.message.endsWith(
    "You do not have permission to join this voice channel."
  )
    ? "Error: I don't have permission to join your voice channel"
    : error.message.endsWith("No result!")
    ? "Error: I can't find anything, check your URL or query"
    : error.message.includes("youtube-dl")
    ? "Error: I can't play that URL"
    : "";
  if (!description) {
    client.emit("error", error);
  }

  channel.send({
    embeds: [{ description: description || "Error: I can't do that, sorry" }],
  });
});

distube.on("finish", (queue) =>
  queue.textChannel.send({
    embeds: [{ description: "Stopped because the queue is finished" }],
  })
);

distube.on("initQueue", (queue) => {
  queue.autoplay = false;
});

distube.on("noRelated", (queue) =>
  queue.textChannel.send({
    embeds: [
      {
        description:
          "Stopped because the queue is finished and I can't autoplay anything",
      },
    ],
  })
);

distube.on("playSong", (queue, song) =>
  queue.textChannel.send({
    embeds: [
      {
        description: `${
          client.user === song.user ? "Autoplaying" : "Playing"
        } ${formatSong(song)}`,
      },
    ],
  })
);

client.on("guildCreate", (guild) => {
  if (guild.available && guild.systemChannel) {
    guild.systemChannel.send({
      embeds: [
        {
          description:
            "Hi! I play music. Type `/help` to find out what I can do for you.",
        },
      ],
    });
  }
});

client.on("error", console.error);

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) {
    return null;
  }

  console.log(
    interaction.createdAt.toISOString(),
    interaction.user.id,
    `/${interaction.guildId}/${interaction.channelId}/${interaction.id}`,
    JSON.stringify(interaction.member.nickname || interaction.user.username),
    JSON.stringify(
      `/${interaction.commandName}${Array.from(
        interaction.options.entries(),
        ([, { name, value }]) => ` ${name}: ${value}`
      ).join("")}`
    )
  );

  const command = commands[interaction.commandName];
  if (!command) {
    return interaction.reply({
      embeds: [{ description: "Error: I can't do that yet, sorry" }],
    });
  }

  return command.handler(interaction, distube);
});

client.once("ready", async () => {
  console.log(client.readyAt.toISOString(), "READY");
  if (!client.application.owner) {
    await client.application.fetch();
  }

  await client.application.commands
    .set(
      Object.values(commands).map(({ data }) => data),
      process.env.GUILD_ID
    )
    .catch(({ message }) => console.error(message));
});

client.login(process.env.TOKEN);

require("dotenv").config();
const SpotifyPlugin = require("@distube/spotify");
const { Client } = require("discord.js");
const { DisTube } = require("distube");
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
          description:
            "I play music. Type `/help` to find out what I can do for you.",
        },
      ],
    });
  }
});

client.on("error", console.error);

client.on("interaction", (interaction) => {
  if (!interaction.isCommand()) {
    return null;
  }

  console.log(
    interaction.createdAt.toISOString(),
    interaction.user.id,
    `/${interaction.guildID}/${interaction.channelID}/${interaction.id}`,
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
      embeds: [{ title: "Error", description: "I can't do that yet, sorry" }],
    });
  }

  return command.handler(interaction, distube);
});

client.once("ready", async () => {
  console.log(client.readyAt.toISOString(), "READY");
  const { application } = client;
  if (!application.owner) {
    await application.fetch();
  }

  await application.commands.set(
    Object.values(commands).map(({ data }) => data),
    process.env.GUILD_ID
  );
});

client.login(process.env.TOKEN);

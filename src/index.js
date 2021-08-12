import "dotenv/config";
import { SpotifyPlugin } from "@distube/spotify";
import { Client } from "discord.js";
import { DisTube } from "distube";
import commands from "./commands/index.js";
import formatError from "./format-error.js";
import formatSong from "./format-song.js";
import inviteUrl from "./invite-url.js";

const client = new Client({
  allowedMentions: { parse: ["users"] },
  intents: ["GUILDS", "GUILD_VOICE_STATES"],
  presence: { activity: { name: "/help", type: "LISTENING" } },
});

const distube = new DisTube(client, {
  plugins: [new SpotifyPlugin()],
  emitNewSongOnly: true,
  leaveOnFinish: true,
  savePreviousSongs: false,
});

distube.on("addList", (queue, playlist) => {
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
  });
});

distube.on("addSong", (queue, song) => {
  queue.textChannel.send({
    embeds: [{ description: `Queued ${formatSong(song)}` }],
  });
});

distube.on("empty", (queue) => {
  queue.textChannel.send({
    embeds: [{ description: "Stopped because the voice channel is empty" }],
  });
});

distube.on("error", (channel, error) => {
  const message = formatError(error);
  if (!message) {
    console.error(error);
  }

  channel.send({
    embeds: [{ description: message || "Error: Something went wrong, sorry" }],
  });
});

distube.on("finish", (queue) => {
  queue.textChannel.send({
    embeds: [{ description: "Stopped because the queue is finished" }],
  });
});

distube.on("initQueue", (queue) => {
  queue.autoplay = false;
});

distube.on("noRelated", (queue) => {
  queue.textChannel.send({
    embeds: [
      {
        description:
          "Stopped because the queue is finished and I can't autoplay anything",
      },
    ],
  });
});

distube.on("playSong", (queue, song) => {
  queue.textChannel.send({
    embeds: [
      {
        description: `${
          client.user === song.user ? "Autoplaying" : "Playing"
        } ${formatSong(song)}`,
      },
    ],
  });
});

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
    return;
  }

  const argv = [`/${interaction.commandName}`];
  const options = [...interaction.options.data];
  while (options.length > 0) {
    const option = options.shift();
    if (option.value != null) {
      argv.push(`${option.name}:`, option.value);
    } else {
      argv.push(option.name);
    }

    if (option.options) {
      options.push(...option.options.values());
    }
  }

  console.log(
    interaction.createdAt.toISOString(),
    interaction.user.id,
    `/${interaction.guildId}/${interaction.channelId}/${interaction.id}`,
    JSON.stringify(interaction.member.nickname || interaction.user.username),
    JSON.stringify(argv.join(" "))
  );

  const command = commands[interaction.commandName];
  if (!command) {
    interaction.reply({
      embeds: [{ description: "Error: I can't do that yet, sorry" }],
    });
    return;
  }

  command.handler(interaction, distube);
});

client.once("ready", async () => {
  console.log(
    client.readyAt.toISOString(),
    client.user.id,
    inviteUrl(client.user.id),
    JSON.stringify(client.user.username),
    '"READY"'
  );
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

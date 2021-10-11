import "dotenv/config";
import { SpotifyPlugin } from "@distube/spotify";
import { Client, Intents } from "discord.js";
import { DisTube } from "distube";
import commands from "./commands/index.js";
import formatCommandInteraction from "./formatters/format-command-interaction.js";
import formatError from "./formatters/format-error.js";
import formatPlaylist from "./formatters/format-playlist.js";
import formatSong from "./formatters/format-song.js";
import formatInviteUrl from "./formatters/format-invite-url.js";
import permissions from "./permissions.js";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

const distube = new DisTube(client, {
  plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true })],
  emitNewSongOnly: true,
  leaveOnFinish: true,
  savePreviousSongs: false,
  nsfw: true,
});

distube.on("addList", (queue, playlist) => {
  queue.textChannel.send({
    embeds: [{ description: `Queued ${formatPlaylist(playlist)}` }],
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

  console.log(formatCommandInteraction(interaction));

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
    formatInviteUrl({ client_id: client.user.id, permissions }),
    JSON.stringify(client.user.username),
    '"READY"'
  );
  if (!client.application.owner) {
    await client.application.fetch();
  }

  await client.application.commands
    .set(
      Object.values(commands).map(({ data }) => data),
      process.env.GUILD_ID // If defined, set commands only for this guild
    )
    .catch(({ message }) => console.error(message));
});

client.login(process.env.TOKEN);

import "dotenv/config";
import { SpotifyPlugin } from "@distube/spotify";
import { Client, Intents } from "discord.js";
import { DisTube as Player } from "distube";
import commands from "./commands/index.js";
import formatError from "./formatters/format-error.js";
import formatPlaylist from "./formatters/format-playlist.js";
import formatSong from "./formatters/format-song.js";
import formatInviteUrl from "./formatters/format-invite-url.js";
import permissions from "./permissions.js";

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES],
});

const player = new Player(client, {
  plugins: [new SpotifyPlugin({ emitEventsAfterFetching: true })],
  emitNewSongOnly: true,
  leaveOnFinish: true,
  savePreviousSongs: false,
  nsfw: true,
});

player.on("addList", (queue, playlist) => {
  queue.textChannel.send({
    embeds: [{ description: `Queued ${formatPlaylist(playlist)}` }],
  });
});

player.on("addSong", (queue, song) => {
  queue.textChannel.send({
    embeds: [{ description: `Queued ${formatSong(song)}` }],
  });
});

player.on("disconnect", (queue) => {
  queue.textChannel.send({
    embeds: [{ description: "I stopped because I was disconnected" }],
  });
});

player.on("empty", (queue) => {
  queue.textChannel.send({
    embeds: [{ description: "I stopped because the voice channel is empty" }],
  });
});

player.on("error", (channel, error) => {
  const message = formatError(error);
  if (!message) {
    console.error(error);
  }

  channel.send({
    embeds: [{ description: message || "Error: Something went wrong, sorry" }],
  });
});

player.on("finish", (queue) => {
  queue.textChannel.send({
    embeds: [{ description: "I stopped because the queue is finished" }],
  });
});

player.on("initQueue", (queue) => {
  queue.autoplay = false;
});

player.on("noRelated", (queue) => {
  queue.textChannel.send({
    embeds: [
      {
        description:
          "I stopped because the queue is finished and I can't autoplay anything",
      },
    ],
  });
});

player.on("playSong", (queue, song) => {
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

client.on("error", console.error);

client.on("guildCreate", (guild) => {
  console.log(
    "%s (%s) joined %s (%s) on %s",
    client.user.tag,
    client.user.toString(),
    guild.name,
    guild.id,
    guild.joinedAt.toUTCString()
  );
});

client.on("interactionCreate", (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  console.log(
    '%s (%s) used "%s" at %s (%s) #%s (%s) on %s',
    interaction.user.tag,
    interaction.user.toString(),
    interaction.toString(),
    interaction.guild.name,
    interaction.guild.id,
    interaction.channel.name,
    interaction.channel.toString(),
    interaction.createdAt.toUTCString()
  );

  const command = commands[interaction.commandName];
  if (!command) {
    interaction.reply({
      embeds: [{ description: "Error: I can't do that yet, sorry" }],
    });
    return;
  }

  command.handler(interaction, player);
});

client.once("ready", async () => {
  console.log(
    "%s (%s) ready at %s on %s",
    client.user.tag,
    client.user.toString(),
    formatInviteUrl({ client_id: client.user.id, permissions }),
    client.readyAt.toUTCString()
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

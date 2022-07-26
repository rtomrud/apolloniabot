import "dotenv/config";
import { Client, Colors, InteractionType, hyperlink } from "discord.js";
import { DisTube as Player } from "distube";
import commands from "./commands/index.js";
import { ResolverPlugin } from "./plugins/resolver-plugin.js";
import { SpotifyPlugin } from "./plugins/spotify-plugin.js";
import { YouTubeSearchPlugin } from "./plugins/youtube-search-plugin.js";
import { YtDlpPlugin } from "./plugins/yt-dlp-plugin.js";
import intents from "./intents.js";

const client = new Client({ intents });

const player = new Player(client, {
  plugins: [
    new ResolverPlugin(),
    new YouTubeSearchPlugin(),
    new SpotifyPlugin(),
    new YtDlpPlugin(),
  ],
  emitNewSongOnly: true,
  leaveOnFinish: true,
  savePreviousSongs: false,
  nsfw: true,
});

player.on("addList", async (queue, playlist) => {
  await playlist.metadata.interactionResponse;
  playlist.metadata.interaction.followUp({
    embeds: [
      {
        description: `${
          queue.songs[0] === playlist.songs[0] ? "Playing" : "Queued"
        } ${hyperlink(
          `${playlist.songs[0].name}${
            playlist.songs.length > 1
              ? ` and ${playlist.songs.length - 1} more ${
                  playlist.songs.length - 1 === 1 ? "track" : "tracks"
                }`
              : ""
          }`,
          playlist.url
        )}`,
      },
    ],
  });
});

player.on("addSong", async (queue, song) => {
  await song.metadata.interactionResponse;
  song.metadata.interaction.followUp({
    embeds: [
      {
        description: `${
          queue.songs[0] === song ? "Playing" : "Queued"
        } ${hyperlink(song.name, song.url)}`,
      },
    ],
  });
});

player.on("error", (channel, error) => console.error(error));

client.on("error", console.error);

client.on("guildCreate", (guild) => {
  console.log(
    JSON.stringify({
      event: "GUILD_CREATE",
      guild: guild.name,
      guildId: guild.id,
      joinedAt: guild.joinedAt.toISOString(),
    })
  );
});

client.on("guildDelete", (guild) => {
  if (!guild.available) {
    return;
  }

  console.log(
    JSON.stringify({
      event: "GUILD_DELETE",
      guild: guild.name,
      guildId: guild.id,
      joinedAt: guild.joinedAt.toISOString(),
    })
  );
});

client.on("interactionCreate", (interaction) => {
  if (
    interaction.type !== InteractionType.ApplicationCommand &&
    interaction.type !== InteractionType.MessageComponent
  ) {
    return;
  }

  console.log(
    JSON.stringify({
      event: "INTERACTION_CREATE",
      data: interaction.customId || interaction.toString(),
      user: interaction.user.tag,
      userId: interaction.user.id,
      guild: interaction.guild.name,
      guildId: interaction.guild.id,
      channel: interaction.channel.name,
      channelId: interaction.channel.id,
      createdAt: interaction.createdAt.toISOString(),
      id: interaction.id,
    })
  );

  const commandName =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.commandName
      : interaction.customId.split(" ")[0].replace("/", "");
  const command = commands[commandName];
  if (!command) {
    interaction.reply({
      embeds: [
        { description: "Error: I can't do that yet, sorry", color: Colors.Red },
      ],
    });
    return;
  }

  command.handler(interaction, player).catch(console.error);
});

client.on("ready", async (client) => {
  console.log(
    JSON.stringify({
      event: "READY",
      user: client.user.tag,
      userId: client.user.id,
      readyAt: client.readyAt.toISOString(),
    })
  );

  await client.application.commands
    .set(Object.values(commands).map(({ data }) => data.toJSON()))
    .catch(console.error);
});

client.login(process.env.TOKEN);

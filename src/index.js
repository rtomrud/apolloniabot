import "dotenv/config";
import { Client, Colors, Events, InteractionType, hyperlink } from "discord.js";
import { DisTube as Player, Events as PlayerEvents } from "distube";
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
  leaveOnFinish: true,
  savePreviousSongs: false,
  nsfw: true,
});

player.on(PlayerEvents.ADD_LIST, async (queue, playlist) => {
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

player.on(PlayerEvents.ADD_SONG, async (queue, song) => {
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

player.on(PlayerEvents.DISCONNECT, (queue) => {
  console.log(
    JSON.stringify({
      event: "DISCONNECT",
      guild: queue.voiceChannel.guild.name,
      guildId: queue.voiceChannel.guildId,
      channel: queue.voiceChannel.name,
      channelId: queue.voiceChannel.id,
      date: new Date().toISOString(),
    })
  );
});

player.on(PlayerEvents.EMPTY, (queue) => {
  console.log(
    JSON.stringify({
      event: "EMPTY",
      guild: queue.voiceChannel.guild.name,
      guildId: queue.voiceChannel.guildId,
      channel: queue.voiceChannel.name,
      channelId: queue.voiceChannel.id,
      date: new Date().toISOString(),
    })
  );
});

player.on(PlayerEvents.ERROR, (channel, error) => console.error(error));

player.on(PlayerEvents.FINISH, (queue) => {
  console.log(
    JSON.stringify({
      event: "FINISH",
      guild: queue.voiceChannel.guild.name,
      guildId: queue.voiceChannel.guildId,
      channel: queue.voiceChannel.name,
      channelId: queue.voiceChannel.id,
      date: new Date().toISOString(),
    })
  );
});

player.on(PlayerEvents.FINISH_SONG, (queue, song) => {
  console.log(
    JSON.stringify({
      event: "FINISH_SONG",
      data: `${song.name} <${song.url}>`,
      guild: queue.voiceChannel.guild.name,
      guildId: queue.voiceChannel.guildId,
      channel: queue.voiceChannel.name,
      channelId: queue.voiceChannel.id,
      date: new Date().toISOString(),
    })
  );
});

player.on(PlayerEvents.PLAY_SONG, (queue, song) => {
  console.log(
    JSON.stringify({
      event: "PLAY_SONG",
      data: `${song.name} <${song.url}>`,
      guild: queue.voiceChannel.guild.name,
      guildId: queue.voiceChannel.guildId,
      channel: queue.voiceChannel.name,
      channelId: queue.voiceChannel.id,
      date: new Date().toISOString(),
    })
  );
});

client.on(Events.Error, console.error);

client.on(Events.GuildCreate, (guild) => {
  console.log(
    JSON.stringify({
      event: Events.GuildCreate,
      guild: guild.name,
      guildId: guild.id,
      date: guild.joinedAt.toISOString(),
    })
  );
});

client.on(Events.GuildDelete, (guild) => {
  if (!guild.available) {
    return;
  }

  console.log(
    JSON.stringify({
      event: "GUILD_DELETE",
      guild: guild.name,
      guildId: guild.id,
      date: guild.joinedAt.toISOString(),
    })
  );
});

client.on(Events.InteractionCreate, (interaction) => {
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
      date: interaction.createdAt.toISOString(),
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

client.on(Events.ClientReady, async (client) => {
  console.log(
    JSON.stringify({
      event: "READY",
      user: client.user.tag,
      userId: client.user.id,
      date: client.readyAt.toISOString(),
    })
  );

  await client.application.commands
    .set(Object.values(commands).map(({ data }) => data.toJSON()))
    .catch(console.error);
});

client.login(process.env.TOKEN);

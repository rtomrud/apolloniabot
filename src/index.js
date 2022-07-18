import "dotenv/config";
import { Client, Colors, InteractionType, hyperlink } from "discord.js";
import { DisTube as Player } from "../node_modules/distube/dist/index.js";
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
  await playlist.metadata.interaction.fetchReply();
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
  await song.metadata.interaction.fetchReply();
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

const errorMessages = {
  NOT_IN_VOICE: "I can't join you because you're not in a voice channel",
  VOICE_FULL: "I can't join your voice channel because it's full",
  VOICE_CONNECT_FAILED:
    "I can't join you because I can't connect to your voice channel",
  VOICE_MISSING_PERMS:
    "I can't join your voice channel because I don't have permission",
  VOICE_RECONNECT_FAILED:
    "I can't join you because I can't reconnect to your voice channel",
  VOICE_CHANGE_GUILD: "I can't join you because you're in another server",
  NO_RESULT: "I can't find that",
  NO_RELATED: "I can't find any related track",
  CANNOT_PLAY_RELATED: "I can't play any related track",
  UNAVAILABLE_VIDEO: "I can't play that because it's unavailable",
  UNPLAYABLE_FORMATS: "I can't play that because it's in an unplayable format",
  NON_NSFW:
    "I can't play that because it's age-restricted content and this is a SFW channel",
  NOT_SUPPORTED_URL: "I can't play that because the website is unsupported",
  CANNOT_RESOLVE_SONG: "I can't play that because the track is unresolved",
  EMPTY_FILTERED_PLAYLIST:
    "I can't play that because there's no valid track or there's only age-restricted content and this is a SFW channel",
  EMPTY_PLAYLIST: "I can't play that because there's no valid track",
  SPOTIFY_PLUGIN_NO_RESULT: "I can't find that",
  YTDLP_ERROR: "I can't play that",
};

const defaultErrorMessage = "Something went wrong, sorry";

client.on("interactionCreate", (interaction) => {
  if (!interaction.type === InteractionType.ApplicationCommand) {
    return;
  }

  console.log(
    JSON.stringify({
      event: "INTERACTION_CREATE",
      data: interaction.toString(),
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

  const command = commands[interaction.commandName];
  if (!command) {
    interaction.reply({
      embeds: [
        { description: "Error: I can't do that yet, sorry", color: Colors.Red },
      ],
    });
    return;
  }

  command.handler(interaction, player).catch((error) => {
    const errorMessage = errorMessages[error.errorCode] || defaultErrorMessage;
    if (
      errorMessage === defaultErrorMessage ||
      error.errorCode === "SPOTIFY_PLUGIN_NO_RESULT" ||
      error.errorCode === "YTDLP_ERROR"
    ) {
      console.error(error);
    }

    interaction[interaction.replied ? "followUp" : "reply"]({
      embeds: [{ description: `Error: ${errorMessage}`, color: Colors.Red }],
    }).catch(console.error);
  });
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

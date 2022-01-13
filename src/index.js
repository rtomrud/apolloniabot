import "dotenv/config";
import { SpotifyPlugin } from "@distube/spotify";
import { Client, Intents } from "discord.js";
import { DisTube as Player } from "distube";
import commands from "./commands/index.js";
import permissions from "./permissions.js";
import scopes from "./scopes.js";

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
    embeds: [
      {
        description: `Queued [${playlist.songs[0].name}${
          playlist.songs.length > 1
            ? ` and ${playlist.songs.length - 1} more track${
                playlist.songs.length === 2 ? "" : "s"
              }`
            : ""
        }](${playlist.url}) [${playlist.formattedDuration}]`,
      },
    ],
  });
});

player.on("addSong", (queue, song) => {
  queue.textChannel.send({
    embeds: [{ description: `Queued [${song.name}](${song.url})` }],
  });
});

player.on("empty", (queue) => {
  queue.textChannel.send({
    embeds: [{ description: "I stopped because the voice channel is empty" }],
  });
});

player.on("error", (channel, error) => {
  const formatErrorMessage = (error) => {
    switch (error.errorCode) {
      case "NOT_IN_VOICE":
      case "NOT_SUPPORTED_VOICE":
      case "VOICE_CHANGE_GUILD":
        return "Error: I can't join you because you're not in a voice channel";
      case "VOICE_FULL":
        return "Error: I can't join your voice channel because it's full";
      case "VOICE_CONNECT_FAILED":
      case "VOICE_RECONNECT_FAILED":
        return "Error: I can't connect to your voice channel";
      case "VOICE_MISSING_PERMS":
        return "Error: I can't join your voice channel because I don't have permission";
      case "NO_RESULT":
        return "Error: I can't find anything";
      case "NO_RELATED":
      case "CANNOT_PLAY_RELATED":
        return "Error: I can't play any related track";
      case "UNAVAILABLE_VIDEO":
        return "Error: I can't play that because it's unavailable";
      case "UNPLAYABLE_FORMATS":
      case "NOT_SUPPORTED_URL":
      case "CANNOT_RESOLVE_SONG":
        return "Error: I can't play that";
      case "NO_VALID_SONG":
      case "EMPTY_FILTERED_PLAYLIST":
      case "EMPTY_PLAYLIST":
        return "Error: I can't play that because there's no valid track";
      case "NON_NSFW":
        return "Error: I can't play age-restricted content in a non-NSFW channel";
      case "INVALID_TYPE":
        return "Error: I can't play that because it's not a valid URL";
      default: {
        if (error.message.includes("[youtube-dl] ERROR: Unsupported URL")) {
          return "Error: I can't play that URL";
        }

        return null;
      }
    }
  };

  const message = formatErrorMessage(error);
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
        title: song.name,
        url: song.url,
        fields: [
          { name: "Duration", value: song.formattedDuration, inline: true },
          { name: "Requester", value: song.user.toString(), inline: true },
        ],
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
    client.generateInvite({ permissions, scopes }),
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

require("dotenv").config();
const SpotifyPlugin = require("@distube/spotify");
const { Client } = require("discord.js");
const { DisTube } = require("distube");
const sec = require("sec");
const formatPlayback = require("./format-playback.js");
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

client.on("interaction", async (interaction) => {
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

  const { commandName } = interaction;
  if (commandName === "autoplay") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to autoplay" }],
      });
    }

    const autoplay = queue.toggleAutoplay();
    return interaction.reply({
      embeds: [{ title: "Autoplay", description: autoplay ? "on" : "off" }],
    });
  }

  if (commandName === "drop") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to drop" }],
      });
    }

    const { length } = queue.songs;
    const track = interaction.options.get("track").value;
    if (track === 0 || track > length) {
      return interaction.reply({
        embeds: [
          { title: "Error", description: "Nothing to drop at that position" },
        ],
      });
    }

    if (track === 1 && queue.playing) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "I can't drop track 1 because it's playing now",
          },
        ],
      });
    }

    const start = track < 0 ? Math.max(0, length + track) : track - 1;
    const [song] = queue.songs.splice(start, 1);
    return interaction.reply({
      embeds: [
        {
          title: "Dropped",
          fields: [{ name: String(start + 1), value: formatSong(song) }],
        },
      ],
    });
  }

  if (commandName === "effect") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue || !queue.playing) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to apply effect to" }],
      });
    }

    const filter = interaction.options.get("effect").value;
    const filters = queue.setFilter(filter);
    return interaction.reply({
      embeds: [{ title: "Effects", description: filters.join(", ") || "off" }],
    });
  }

  if (commandName === "play") {
    const { channelID, member } = interaction;
    const voiceChannel = member.voice.channel;
    if (!voiceChannel) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description:
              "I can't join you because you're not in a voice channel",
          },
        ],
      });
    }

    const query = interaction.options.get("query").value;
    const textChannel = await client.channels.fetch(channelID);
    distube.playVoiceChannel(voiceChannel, query, { member, textChannel });
    return interaction.reply({
      embeds: [{ title: "Searching", description: query }],
    });
  }

  if (commandName === "find") {
    const query = interaction.options.get("query").value;
    interaction.reply({ embeds: [{ title: "Searching", description: query }] });
    return distube.search(query, { limit: 10 }).then(
      (searchResults) =>
        interaction.followUp({
          embeds: [
            {
              title: "Results",
              fields: searchResults.map(
                ({ formattedDuration, name, type, uploader, url }) => ({
                  name: uploader.name || "[Unknown]",
                  value: `[${name}](${url}) [${
                    type === "video" ? formattedDuration : "Playlist"
                  }]`,
                })
              ),
              footer: { text: "Powered by YouTube" },
            },
          ],
        }),
      () =>
        interaction.followUp({
          embeds: [{ title: "Error", description: "I couldn't find anything" }],
        })
    );
  }

  if (commandName === "help") {
    return interaction.reply({
      embeds: [
        {
          title: "Lena Bot",
          description: `I play music. [Invite me to your server!](https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=2150647872&scope=bot%20applications.commands)`,
          url: "https://discord.gg/wp3HWnUDMa",
          fields: [
            {
              name: "/play",
              value: "Play a track or playlist",
            },
            {
              name: "/find",
              value: "Search on YouTube and show the search results",
            },
            {
              name: "/pause",
              value: "Pause the playback",
            },
            {
              name: "/resume",
              value: "Resume the playback",
            },
            {
              name: "/what",
              value: "Show what's playing and the status of the player",
            },
            {
              name: "/queue",
              value: "Show the queue",
            },
            {
              name: "/next",
              value: "Play the next track in the queue",
            },
            {
              name: "/move",
              value: "Move a track to another position in the queue",
            },
            {
              name: "/shuffle",
              value: "Shuffle the queue",
            },
            {
              name: "/drop",
              value: "Drop a track from the queue",
            },
            {
              name: "/stop",
              value:
                "Stop the playback, clear the queue and leave the voice channel",
            },
            {
              name: "/seek",
              value: "Seek the current track to a specified time",
            },
            {
              name: "/volume",
              value: "Set the volume of the playback",
            },
            {
              name: "/autoplay",
              value:
                "Toggle whether a related track is played when the queue ends",
            },
            {
              name: "/loop",
              value: "Loop the queue or current track",
            },
            {
              name: "/effect",
              value: "Applies an effect to the audio stream",
            },
          ],
        },
      ],
    });
  }

  if (commandName === "loop") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to loop" }],
      });
    }

    const mode = Number(interaction.options.values().next().value.value);
    const repeatMode = queue.setRepeatMode(mode);
    return interaction.reply({
      embeds: [
        { title: "Loop", description: ["off", "track", "queue"][repeatMode] },
      ],
    });
  }

  if (commandName === "move") {
    const queue = distube.queues.get(interaction.guildID);
    const { length } = queue.songs;
    if (!queue) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to move" }],
      });
    }

    const track = interaction.options.get("track").value;
    const position = interaction.options.get("position").value;
    if (track === 0 || track > length) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "No track at that position" }],
      });
    }

    if (position < 1 || position > length) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "No such position" }],
      });
    }

    if (track === 1 || position === 1) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "I can't move track 1 because it's currently playing",
          },
        ],
      });
    }

    const from = track < 0 ? Math.max(0, length + track) : track - 1;
    const to = position < 0 ? Math.max(0, length + position) : position - 1;
    queue.songs.splice(to, 0, queue.songs.splice(from, 1)[0]);
    return interaction.reply({
      embeds: [
        {
          title: "Moved",
          description: `track ${from + 1} to position ${to + 1}`,
        },
      ],
    });
  }

  if (commandName === "next") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue || (queue.songs.length <= 1 && !queue.autoplay)) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to skip" }],
      });
    }

    const [previousSong] = queue.songs;
    queue.skip();
    return interaction.reply({
      embeds: [{ title: "Skipped", description: formatSong(previousSong) }],
    });
  }

  if (commandName === "pause") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue || !queue.playing) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to pause" }],
      });
    }

    queue.pause();
    return interaction.reply({
      embeds: [{ title: "Paused", description: formatPlayback(queue) }],
    });
  }

  if (commandName === "queue") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing in queue" }],
      });
    }

    const page = interaction.options.has("page")
      ? interaction.options.get("page").value
      : 1;
    const { formattedDuration, songs } = queue;
    const { length } = songs;
    const pageSize = 10;
    const pages = Math.ceil(length / pageSize);
    if (page < 1 || page > pages) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "No such page in the queue" }],
      });
    }

    const start = (page - 1) * pageSize;
    const end = Math.min(page * pageSize, length);
    return interaction.reply({
      embeds: [
        {
          title: "Queue",
          description: `${length} track${
            length === 1 ? "" : "s"
          } [${formattedDuration}]`,
          fields: songs.slice(start, end).map((song, i) => ({
            name: String(i + start + 1),
            value: song === songs[0] ? formatPlayback(queue) : formatSong(song),
          })),
          footer: { text: `Page ${page} of ${pages}` },
        },
      ],
    });
  }

  if (commandName === "resume") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue || queue.playing) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to resume" }],
      });
    }

    queue.resume();
    return interaction.reply({
      embeds: [{ title: "Resumed", description: formatPlayback(queue) }],
    });
  }

  if (commandName === "seek") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue || !queue.playing) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to seek on" }],
      });
    }

    const { currentTime, songs } = queue;
    const seconds = sec(interaction.options.get("time").value);
    const mode = interaction.options.has("mode")
      ? interaction.options.get("mode").value
      : "";
    const time =
      mode === "+"
        ? currentTime + seconds
        : mode === "-"
        ? currentTime - seconds
        : seconds;
    queue.seek(Math.max(0, Math.min(time, songs[0].duration)));
    return interaction.reply({
      embeds: [{ title: "Seeked", description: formatPlayback(queue) }],
    });
  }

  if (commandName === "shuffle") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue || queue.songs.length <= 1) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to shuffle" }],
      });
    }

    queue.shuffle();
    return interaction.reply({ embeds: [{ title: "Shuffled the queue" }] });
  }

  if (commandName === "stop") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to stop" }],
      });
    }

    const description = queue.playing ? formatPlayback(queue) : "";
    queue.stop();
    return interaction.reply({ embeds: [{ title: "Stopped", description }] });
  }

  if (commandName === "volume") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue) {
      return interaction.reply({
        embeds: [{ title: "Error", description: "Nothing to set volume to" }],
      });
    }

    const percent = interaction.options.get("percent").value;
    if (percent <= 0) {
      return interaction.reply({
        embeds: [
          { title: "Error", description: "I can't set the volume that low" },
        ],
      });
    }

    if (percent > 100) {
      return interaction.reply({
        embeds: [
          {
            title: "Error",
            description: "I can't [go to 11](https://youtu.be/4xgx4k83zzc)",
          },
        ],
      });
    }

    queue.setVolume(percent);
    return interaction.reply({
      embeds: [{ title: "Volume", description: percent }],
    });
  }

  if (commandName === "what") {
    const queue = distube.queues.get(interaction.guildID);
    if (!queue) {
      return interaction.reply({
        embeds: [{ description: "Nothing in queue" }],
      });
    }

    const { autoplay, filters, formattedDuration, repeatMode, songs, volume } =
      queue;
    const { length } = songs;
    return interaction.reply({
      embeds: [
        {
          title: queue.playing ? "Now playing" : "Now paused",
          description: formatPlayback(queue),
          fields: [
            {
              name: "Requester",
              value: songs[0].user.toString(),
              inline: true,
            },
            { name: "Volume", value: String(volume), inline: true },
            {
              name: "Queue",
              value: `${length} track${
                length === 1 ? "" : "s"
              } [${formattedDuration}]`,
              inline: true,
            },
            {
              name: "Effects",
              value: filters.join(", ") || "off",
              inline: true,
            },
            {
              name: "Loop",
              value: ["off", "track", "queue"][repeatMode],
              inline: true,
            },
            { name: "Autoplay", value: autoplay ? "on" : "off", inline: true },
          ],
        },
      ],
    });
  }

  return interaction.reply({
    embeds: [{ title: "Error", description: "I can't do that yet, sorry" }],
  });
});

client.once("ready", async () => {
  console.log(client.readyAt.toISOString(), "READY");
  const { application } = client;
  if (!application.owner) {
    await application.fetch();
  }

  await application.commands.set(
    [
      {
        name: "autoplay",
        description:
          "Toggle whether a related track is played when the queue ends",
      },
      {
        name: "drop",
        description: "Drop a track from the queue",
        options: [
          {
            name: "track",
            description: "The position of the track to drop",
            type: "INTEGER",
            required: true,
          },
        ],
      },
      {
        name: "effect",
        description: "Toggles the specified effect",
        options: [
          {
            name: "effect",
            description: "The effect to toggle",
            type: "STRING",
            required: true,
            choices: [
              { name: "3d", value: "3d" },
              { name: "bassboost", value: "bassboost" },
              { name: "echo", value: "echo" },
              { name: "karaoke", value: "karaoke" },
              { name: "nightcore", value: "nightcore" },
              { name: "vaporwave", value: "vaporwave" },
            ],
          },
        ],
      },
      {
        name: "find",
        description: "Search on YouTube and show the search results",
        options: [
          {
            name: "query",
            description: "The search query",
            type: "STRING",
            required: true,
          },
        ],
      },
      {
        name: "help",
        description: "Show help",
      },
      {
        name: "loop",
        description: "Loop the queue or current track",
        options: [
          {
            name: "mode",
            description: "The loop mode",
            type: "STRING",
            required: true,
            choices: [
              { name: "off", value: "0" },
              { name: "queue", value: "2" },
              { name: "track", value: "1" },
            ],
          },
        ],
      },
      {
        name: "move",
        description: "Move a track to another position in the queue",
        options: [
          {
            name: "track",
            description: "The position of the track to move",
            type: "INTEGER",
            required: true,
          },
          {
            name: "position",
            description: "The position to move the track to",
            type: "INTEGER",
            required: true,
          },
        ],
      },
      {
        name: "next",
        description: "Play the next track in the queue",
      },
      {
        name: "pause",
        description: "Pause the playback",
      },
      {
        name: "play",
        description: "Play a track or playlist",
        options: [
          {
            name: "query",
            description:
              "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube",
            type: "STRING",
            required: true,
          },
        ],
      },
      {
        name: "queue",
        description: "Show the queue",
        options: [
          {
            name: "page",
            description: "The page of the queue to show (defaults to page 1)",
            type: "INTEGER",
          },
        ],
      },
      {
        name: "resume",
        description: "Resume the playback",
      },
      {
        name: "seek",
        description: "Seek the current track to a specified time",
        options: [
          {
            name: "time",
            description: "The time in seconds or in HH:MM:SS format",
            type: "STRING",
            required: true,
          },
          {
            name: "mode",
            description:
              "Whether to seek forward or back by the specified time",
            type: "STRING",
            choices: [
              { name: "back", value: "-" },
              { name: "forward", value: "+" },
            ],
          },
        ],
      },
      {
        name: "shuffle",
        description: "Shuffle the queue",
      },
      {
        name: "stop",
        description:
          "Stop the playback, clear the queue and leave the voice channel",
      },
      {
        name: "volume",
        description: "Set the volume of the playback",
        options: [
          {
            name: "percent",
            description: "The volume (1 to 100)",
            type: "INTEGER",
            required: true,
          },
        ],
      },
      {
        name: "what",
        description: "Show what's playing and the status of the player",
      },
    ],
    process.env.GUILD_ID
  );
});

client.login(process.env.TOKEN);

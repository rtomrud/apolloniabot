require("dotenv").config();
const { Player } = require("discord-player");
const { Client } = require("discord.js");
const aliases = require("./aliases.js");

const prefixRegExp = /^lena/i;
const separatorRegExp = /\s+/;

const version = new Date().toISOString().slice(0, -5);
const client = new Client();
const player = new Player(client);

player
  .on("botDisconnect", (message) =>
    message.channel.send({ embed: { description: "Disconnected" } })
  )
  .on("channelEmpty", (message) =>
    message.channel.send({
      embed: {
        description: "Left the voice channel because no one is listening",
      },
    })
  )
  .on("noResults", (message) =>
    message.channel.send({ embed: { description: "I didn't find anything" } })
  )
  .on("playlistAdd", (message, { tracks: { length } }) => {
    message.channel.send({
      embed: {
        description: `Queued ${length} track${length === 1 ? "" : "s"}`,
      },
    });
  })
  .on("queueEnd", (message) =>
    message.channel.send({ embed: { description: "Reached end of queue" } })
  )
  .on("searchInvalidResponse", (message) =>
    message.channel.send({
      embed: { description: "I couldn't perform the search" },
    })
  )
  .on("searchResults", (message, query, tracks, collector) => {
    collector.stop();
    message.channel.send({
      embed: {
        title: "Found these tracks:",
        fields: tracks
          .slice(0, tracks.length < 10 ? tracks.length : 10)
          .map(({ author, duration, title, url }, i) => ({
            name: `${i + 1}. ${author}`,
            value: `[${title}](${url}) [${duration}]`,
          })),
      },
    });
  })
  .on(
    "trackAdd",
    (message, { tracks: { length } }, { duration, title, url }) => {
      if (length > 0) {
        message.channel.send({
          embed: {
            description: `Queued [${title}](${url}) [${duration}]`,
          },
        });
      }
    }
  )
  .on("trackStart", (message, { duration, title, url }) =>
    message.channel.send({
      embed: {
        description: `Playing [${title}](${url}) [${duration}]`,
      },
    })
  )
  .on("error", (error, message) =>
    message.channel.send({
      embed: {
        description:
          error === "LiveVideo"
            ? "I don't know how to play YouTube live streams yet"
            : error === "NotConnected"
            ? "I can't join you because you're not in a voice channel"
            : error === "NotPlaying"
            ? "I can't do that because nothing is playing"
            : error === "UnableToJoin"
            ? "I can't join your voice channel because I don't have permission"
            : error,
      },
    })
  );

client
  .on("message", (message) => {
    if (!prefixRegExp.test(message.content)) {
      return;
    }

    const [, command, ...args] = message.content.split(separatorRegExp);
    switch (aliases[command.toLowerCase()]) {
      case "play": {
        const query = args.join(" ");
        if (!query) {
          message.channel.send({
            embed: { description: "I don't know what you want to play" },
          });
          return;
        }

        player.play(message, query, true);
        return;
      }

      case "find": {
        const query = args.join(" ");
        if (!query) {
          message.channel.send({
            embed: { description: "I don't know what you want to find" },
          });
          return;
        }

        player.play(message, query);
        return;
      }

      case "pause": {
        if (!player.isPlaying(message)) {
          message.channel.send({ embed: { description: "Nothing to pause" } });
          return;
        }

        const { duration, title, url } = player.nowPlaying(message);
        player.pause(message);
        message.channel.send({
          embed: { description: `Paused [${title}](${url}) [${duration}]` },
        });
        return;
      }

      case "unpause": {
        if (!player.isPlaying(message)) {
          message.channel.send({ embed: { description: "Nothing to resume" } });
          return;
        }

        const { duration, title, url } = player.nowPlaying(message);
        player.resume(message);
        message.channel.send({
          embed: { description: `Resumed [${title}](${url}) [${duration}]` },
        });
        return;
      }

      case "stop": {
        if (!player.isPlaying(message)) {
          message.channel.send({
            embed: { description: "Nothing to stop" },
          });
          return;
        }

        const { duration, title, url } = player.nowPlaying(message);
        player.stop(message);
        message.channel.send({
          embed: { description: `Stopped [${title}](${url}) [${duration}]` },
        });
        return;
      }

      case "volume": {
        if (!player.isPlaying(message)) {
          message.channel.send({
            embed: { description: "Nothing to set volume to" },
          });
          return;
        }

        const arg = Number(args.find((arg) => /^\d+/.test(arg)));
        const percent = !arg || arg > 100 ? 100 : arg;
        player.setVolume(message, percent);
        message.channel.send({
          embed: { description: `Set volume to ${percent}%` },
        });
        return;
      }

      case "what": {
        if (!player.isPlaying(message)) {
          message.channel.send({
            embed: { description: "Nothing is playing" },
          });
          return;
        }

        const {
          additionalStreamTime,
          voiceConnection: {
            dispatcher: { streamTime },
          },
        } = player.getQueue(message);
        const { duration, title, url } = player.nowPlaying(message);
        message.channel.send({
          embed: {
            description: `Playing [${title}](${url}) [${new Date(
              streamTime + additionalStreamTime
            )
              .toISOString()
              .slice(11, -5)
              .replace(/^0(0:)?0?/, "")}/${duration}]`,
          },
        });
        return;
      }

      case "queue": {
        const arg = Number(args.find((arg) => /^\d+/.test(arg))) || 1;
        const queue = player.getQueue(message);
        if (!queue) {
          message.channel.send({ embed: { description: "Nothing in queue" } });
          return;
        }

        const { tracks } = queue;
        const { length } = tracks;
        const pages = Math.ceil(length / 10);
        const page = arg * 10 > length ? pages : arg;
        const start = (page - 1) * 10;
        const end = page * 10 < length ? page * 10 : length;
        message.channel.send({
          embed: {
            title: "Queue:",
            fields: tracks
              .slice(start, end)
              .map(({ duration, title, url }, i) => ({
                name: `${i + 1 + start}${i === 0 ? " 🕪" : ""}`,
                value: `[${title}](${url}) [${duration}]`,
              })),
            footer: {
              text:
                pages > 1 ? `Page ${page} of ${pages} (${length} tracks)` : "",
            },
          },
        });
        return;
      }

      case "shuffle": {
        const queue = !player.getQueue(message);
        if (!queue || queue.tracks.length < 2) {
          message.channel.send({
            embed: { description: "Nothing to shuffle" },
          });
          return;
        }

        player.shuffle(message);
        message.channel.send({ embed: { description: "Shuffled queue" } });
        return;
      }

      case "drop": {
        const arg = Number(args.find((arg) => /-?\d+/.test(arg)));
        if (arg === 1) {
          message.channel.send({
            embed: {
              descriptio: "I can't drop that track because it's playing now",
            },
          });
        }

        const { tracks } = player.getQueue(message);
        const { length } = tracks;
        const position =
          Number.isNaN(arg) || arg >= length
            ? length - 1
            : arg < 0
            ? length - arg
            : arg;
        const { duration, title, url } = tracks[position - 1];
        player.remove(message, position);
        message.channel.send({
          embed: { description: `Dropped [${title}](${url}) [${duration}]` },
        });
        return;
      }

      case "cut": {
        const queue = player.getQueue(message);
        const { tracks } = queue;
        const track = tracks[tracks.length - 1];
        const { duration, title, url } = track;
        queue.tracks = [tracks[0], track, ...tracks.slice(1, -1)];
        message.channel.send({
          embed: {
            description: `Next up [${title}](${url}) [${duration}]`,
            footer: {
              text: "Cutting in line is not ok",
            },
          },
        });
        return;
      }

      case "clear": {
        if (!player.getQueue(message)) {
          message.channel.send({ embed: { description: "Nothing to clear" } });
          return;
        }

        player.clearQueue(message);
        message.channel.send({ embed: { description: "Cleared queue" } });
        return;
      }

      case "next": {
        if (!player.isPlaying(message)) {
          message.channel.send({ embed: { description: "Nothing to skip" } });
          return;
        }

        player.skip(message);
        return;
      }

      case "back": {
        if (!player.isPlaying(message)) {
          message.channel.send({
            embed: { description: "Nothing to go back to" },
          });
          return;
        }

        player.back(message);
        return;
      }

      case "repeat": {
        if (!player.isPlaying(message)) {
          message.channel.send({ embed: { description: "Nothing to repeat" } });
          return;
        }

        player.setRepeatMode(message, true);
        message.channel.send({ embed: { description: "Enabled repeat" } });
        return;
      }

      case "unrepeat": {
        if (!player.isPlaying(message)) {
          message.channel.send({
            embed: { description: "Nothing to unrepeat" },
          });
          return;
        }

        player.setRepeatMode(message, false);
        message.channel.send({ embed: { description: "Disabled repeat" } });
        return;
      }

      case "loop": {
        if (!player.isPlaying(message)) {
          message.channel.send({ embed: { description: "Nothing to loop" } });
          return;
        }

        player.setLoopMode(message, true);
        message.channel.send({ embed: { description: "Enabled loop" } });
        return;
      }

      case "unloop": {
        if (!player.isPlaying(message)) {
          message.channel.send({ embed: { description: "Nothing to unloop" } });
          return;
        }

        player.setLoopMode(message, false);
        message.channel.send({ embed: { description: "Disabled loop" } });
        return;
      }

      case "vaporwave": {
        if (!player.isPlaying(message)) {
          message.channel.send({
            embed: { description: "Nothing to vaporwave" },
          });
          return;
        }

        player.setFilters(message, { vaporwave: true });
        message.channel.send({ embed: { description: "Enabled vaporwave" } });
        return;
      }

      case "unvaporwave": {
        if (!player.isPlaying(message)) {
          message.channel.send({
            embed: { description: "Nothing to unvaporwave" },
          });
          return;
        }

        player.setFilters(message, { vaporwave: false });
        message.channel.send({ embed: { description: "Disabled vaporwave" } });
        return;
      }

      case "version": {
        message.channel.send({ embed: { description: version } });
        return;
      }

      case "help": {
        message.channel.send({
          embed: {
            fields: [
              {
                name: "NAME",
                value: "[Lena](https://example.com) - I play music",
              },
              {
                name: "SYNOPSIS",
                value: `lena COMMAND [ARGS]...`,
              },
              {
                name: "COMMANDS",
                value: `
**play**, **p** URL
play a track or playlist at URL, or search it and play it
**find**, **f** TERM...
search TERMS on YouTube and show the results
**pause**
pause playback
**resume**, **r**
resume playback
**stop**
stop playback
**volume**, **v** [PERCENT]
set the volume to VALUE [1-100] (default: 100)
**what**, **w**
show what is currently playing
**queue**, **q** [PAGE]
show the queue, may be queried by PAGE (default: 1)
**shuffle**, **s**
shuffle the queue
**next**, **n**
play the next track in the queue
**back**, **b**
play the previous track
**drop**, **d** [TRACK]
delete the TRACK from the queue (default: last track)
**cut**, **c**
move track from the end of the queue to the start
**clear**
empty the queue
**loop**
loop the queue once it ends
**unloop**
do not loop the queue once it ends
**repeat**
repeat the current track
**unrepeat**
do not repeat the current track
`,
              },
              {
                name: "EXAMPLES",
                value: `\`\`\`
lena play Bohemian Rapsody
lena play https://www.youtube.com/watch?v=fdixQDPA2h0
\`\`\``,
              },
            ],
          },
        });
        return;
      }

      default:
        message.channel.send({
          embed: {
            description: "I don't know what you want, maybe ask me for help",
          },
        });
    }
  })
  .on("error", ({ message }) => console.error(message))
  .once("ready", () => console.log("ready"))
  .login(process.env.TOKEN);

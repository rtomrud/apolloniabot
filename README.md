# Apollonia Bot

![Logo](/assets/icon-256x256.png)

A music bot to listen to any song or podcast together with your friends on Discord.

- Supports almost all audio formats from [practically any site](https://github.com/yt-dlp/yt-dlp/blob/master/supportedsites.md) and Spotify links
- Interactive search with autocomplete when using the [/play](#play) command
- Great U/X: simple, accessible and intuitive [Slash Commands](#commands)
- Open source and self-hostable, see [installation](#installing) and [deployment](#deploying) instructions below

## Invite the bot to your server

[Discord invite link](https://discord.com/oauth2/authorize?client_id=802551830324183062&permissions=2150647808&scope=applications.commands%20bot).

You have to grant the bot at least the "Connect" and "Speak" permissions so that it can work.

We respect your privacy, so our bot only requests the bare minimum permissions needed for its essential features. Unlike many other Discord bots, it **cannot** access the content of your messages (no _Message Content_ intent and no _Read Messages_ permission), **cannot** monitor who the members of a server are (no _Server Members_ intent), and **cannot** track who is online or offline (no _Presence_ intent). Instead, it interacts with you solely through [Slash Commands](https://discord.com/blog/welcome-to-the-new-era-of-discord-apps) and has no access to any additional data.

We do not collect, store or share your data; see our [Privacy Policy](./PRIVACY.md) for details.

## Commands

- [/fx](#fx)
- [/help](#help)
- [/move](#move)
- [/next](#next)
- [/now](#now)
- [/pause](#pause)
- [/play](#play)
- [/queue](#queue)
- [/remove](#remove)
- [/repeat](#repeat)
- [/resume](#resume)
- [/seek](#seek)
- [/shuffle](#shuffle)
- [/speed](#speed)
- [/stop](#stop)
- [/volume](#volume)

### /fx

Enable or disable an audio effect.

Options:

- **`effect`** The audio effect to enable or disable. (`bassboost` | `echo` | `nightcore` | `vaporwave`)
- **`disable`** Whether to turn off the audio effect or not (default: False). (`True` | `False`)

### /help

Show help.

### /move

Move a song to another position in the queue.

Required options:

- **`song`** The name or position of the song to move.
- **`position`** The position to move the song to.

### /next

Skip to the next song in the queue.

### /now

Show what's playing now.

### /pause

Pause the playback.

### /play

Play a song or playlist.

Required options:

- **`query`** The URL of a song, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube.

### /queue

Show the queue.

Options:

- **`page`** The page of the queue to show (1 by default).

### /remove

Remove a song from the queue.

Required options:

- **`song`** The position of the song to remove.

### /repeat

Repeat the queue or current song.

Options:

- **`repeat`** The repeat mode. (`off` | `queue` | `song`)

### /resume

Resume the playback.

### /seek

Seek the current song to the specified time.

#### /seek forward

Seek forward by the specified time.

Options:

- **`time`**: The time to seek forward by, in seconds or in HH:MM:SS format (15s by default).

#### /seek backward

Seek backward by the specified time.

Options:

- **`time`**: The time to seek backward by, in seconds or in HH:MM:SS format (15s by default).

#### /seek to

Seek the specified time.

Required options:

- **`time`**: The time to seek, in seconds or in HH:MM:SS format.

### /shuffle

Shuffle the queue.

### /speed

Set the playback speed.

Options:

- **`speed`** Set the playback speed. (`0.5` | `0.75` | `1.0` | `1.25` | `1.5` | `1.75` | `2`)

### /stop

Stop the playback, clear the queue and leave the voice channel.

### /volume

Set the volume of the playback.

Options:

- **`volume`** The volume to set (between 0 and 100).

## Installing

To clone this repository and install its dependencies, run:

```bash
# Clone this repository with git
git clone https://github.com/rtomrud/apolloniabot

# Swith to the directory
cd apolloniabot

# Install the dependencies with npm
npm install
```

To set it up, go to the [Discord Developer portal](https://discord.com/developers/applications) and put the [ID](./assets/client-id.png) and the [Token](./assets/token.png) in a file named `.env`:

```
CLIENT_ID=802551830324183062
TOKEN=YOUR_CLIENT_SECRET
```

To install the Slash Commands of the bot globally (for all servers the bot is in), run:

```bash
npm run deploy-commands
```

_Note that you only have to do this step once._


To start the bot, run:

```bash
npm start
```

## Deploying

For production deployments, we provide a [Dockerfile](./Dockerfile) and [docker-compose.yml](./docker-compose.yml). Install [Docker](https://docs.docker.com/) and run:

```bash
# Run the bot in a container configured for production
docker compose up -d
```

## Featured in

[Winner of the Best Technical Implementation](https://devpost.com/software/apollonia-bot) prize ($1,500 USD) at the [AWS Graviton Hackathon](https://awsgraviton.devpost.com/).


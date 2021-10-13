## Inspiration

We have spent a lot of time hanging out (virtually) with friends on [Discord](https://discord.com/), particularly during the lockdowns. A lot of times, while being in a group voice chat we want to listen to music or to a podcast together, as if we all were in the same room.

Turns out that this is possible, because Discord provides an API to build bots for their platform. So we have built a Discord bot that let's you play (almost) any song or podcast on a voice channel.

There are already other music bots for Discord, but those didn't cut it for us. First of all, those bots are shared between thousands of Discord servers, so audio quality is unreliable when many users play audio simultaneously and overload their servers. Next, those bots limit audio quality (bitrate) and disable features like audio effects/filters to save on CPU costs. Last but not least, well, the best ones [are gone](https://www.pcgamer.com/google-has-killed-discords-best-music-bot/).

Hence, the solution was to build and deploy our own bot, so that we could have the best audio quality without any lag or choppiness, don't compromise on features, and don't depend on third-parties.

## What it does

- Plays songs, playlists or podcasts on Discord, so that users can listen to it together while they hang out in a voice channel
- Supports almost any audio format, from almost any source, thanks to [`youtube-dl`](https://ytdl-org.github.io/youtube-dl/supportedsites.html)
- Provides great user experience, as the UI is build with [Slash Commands](https://discord.com/blog/slash-commands-are-here), the modern way to interact with Discord bots
- Has all the functionality of a fully-featured music player, including:
  - Commands to control audio playback: `/play`, `/pause`, `/resume`, `/stop`, `/seek`, `/volume`
  - Commands to manage the playlist or queue: `/next`, `/queue`, `/move`, `/drop`, `/shuffle`, `/loop`, `/autoplay`
  - Commands to add sound effects/filters, such as, `/effect bassboost`, `/effect karaoke` or `/effect 3d`

## How we built it

- The application is built with Node.js
- The `discord.js` library is used to interface both with the Discord REST API and the Discord Gateway (through WebSockets)
- The `@discordjs/voice` and `@discordjs/opus` packages are used to send an audio stream to a Discord voice channel
- Under the hood, `youtube-dl` is used to download an audio stream from almost any website or source, and then `ffmpeg` is used to transcode that audio stream (decode from one format and encode to another format) before sending it through a Discord voice connection
- The infrastructure is an Internet-facing AWS VPC with EC2 instances, managed with Terraform

## Challenges we ran into

Streaming audio to a Discord voice channel is computationally expensive, because we have to:

1. Download an audio stream from the source, which could be in any codec and bitrate, since we want to support as many different sources as possible.
2. On the fly, transcode that audio stream to the only codec that Discord supports (Opus) and to the bitrate set by the current Discord voice channel (64/96/128/256/384kbps). This is done with [ffmpeg](https://ffmpeg.org/) and causes high CPU load. If audio effects/filters such as volume control or bassboost are applied, the task consumes even more CPU.
3. Encrypt and send the resulting audio stream to Discord, in real time.

If there's any performance problem, users immediately notice it because the audio becomes laggy and choppy, which is unacceptable. One of the reasons we wanted our own music bot was to ensure we had reliable and high quality audio.

So we had to find a cost-effective infrastructure for this latency-sensitive task. By using the Graviton2 instances, even a small one like the T4g.micro, the application can transcode multiple audio streams simultaneously without any performance degradation. This wasn't the case with similarly priced x86-based instances, which would reach high CPU utilization with just a few simultaneous audio streams and user experience would suffer as a result.

Thus, the ARM-based Graviton2 instances let us deploy a music bot for a very reasonable price while enjoying high quality audio without any lag or choppiness.

## Accomplishments that we're proud of

We build our first Discord bot to solve a problem we had ourselves.

## What we learned

- How to develop a Discord bot, with the help of the Discord.js library
- How to configure and provision all the AWS infrastructure needed for our application (EC2, VPC, IAM, etc.) by using Infrastructure as Code (IaC) tooling (Terraform)
- How to use build a Continuous Delivery pipeline for EC2 instances
- How to set up a CloudWatch agent to publish the application's logs from an EC2 instance to CloudWatch, so that we could set up alerts and use its log querying tools

## What's next for Apollonia Bot

We built this bot to solve a problem we had ourselves, but we believe that other Discord server owners and moderators can also benefit from the reliability and control that a self-hosted music bot provides. Moreover, the recent death of the [Groovy](https://www.theverge.com/2021/8/24/22640024/youtube-discord-groovy-music-bot-closure) and [Rythm](https://www.theverge.com/2021/9/12/22669502/youtube-discord-rythm-music-bot-closure) bots for their violation of YouTube's Terms of Service has left a gap in the Discord music bot space, and their business model proved to be unsustainable. Meanwhile, our music bot, which is self-hosted, private and unmonetized, doesn't violate anyone's Terms of Service and cannot be shut down.

Currently, developers can easily deploy this project on their own AWS accounts, because we provide a Terraform config to set up all the required infrastructure. But we want to thoroughly document this process and provide step-by-step instructions, so that deploying a music bot on EC2 is as easy as possible.

Then, we want to go one step further and also provide an easier setup of the required AWS infrastructure through the AWS Marketplace, so that even non-technical people can deploy this project on EC2, without having to understand how to install and use IaC tools or how to manage environment variables and secrets.

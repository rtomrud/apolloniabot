## Inspiration

We have spent a lot of time hanging out (virtually) with friends on [Discord](https://discord.com/), particularly during the lockdowns. A lot of times, while being in a group voice chat we want to listen to music or to a podcast together, as if we all were in the same room.

Turns out that this is possible, because Discord provides an API to build bots for their platform. So we have built a Discord bot that let's you play (almost) any song or podcast on a voice channel.

There already are existing music bots, but those didn't cut it. Firstly, those bots are shared between thousands of Discord servers, which makes audio quality unreliable during peak hours, when many users play audio simultaneously. Secondly, those bots limit audio quality (bitrate) to save on CPU costs. Lastly, well, the best ones [are gone](https://www.pcgamer.com/google-has-killed-discords-best-music-bot/).

Hence, the solution was to build and self-host our own bot, so that we could have the best audio quality, don't compromise on features, and don't depend on third-parties.

## What it does

[TODO]

## How we built it

- The application is built with Node.js
- The `discord.js` library is used to interface both with the Discord REST API and the Discord Gateway (WebSockets)
- The `@discordjs/voice` and `@discordjs/opus` modules are used to send audio to Discord
- Under the hood, `ffmpeg` is used to transcode audio streams (decode from one format and encode to another format)
- The infrastructure is an AWS VPC with EC2 instances, managed with Terraform

## Challenges we ran into

To play audio on Discord, this bot has to:

1. Download the audio stream from the source, which could be in any codec and bitrate, since we want to support as many different sources as possible.
2. On the fly, transcode that audio stream to the only codec that Discord supports (Opus) and to the bitrate set in the current Discord voice channel (64/96/128/256/384kbps). This is done with [ffmpeg](https://ffmpeg.org/) and is very computationally expensive. If audio effects/filters are applied (like bassboost), the task becomes even more CPU-hungry.
3. Encrypt and send the resulting audio stream to Discord in real time.

If there's any performance problem, users immediately notice it because the audio becomes laggy and choppy, which is unacceptable. One of the reasons we wanted to self-host our own music bot was to ensure we had audio with good quality, and consistently.

So we had to find a cost-effective infrastructure for this computationally expensive task. By using the new Graviton2 instances (even small ones like the T4g.micro), the application could transcode multiple audio streams simultaneously without any performance degradation. This wasn't the case with similarly priced x86_64-based instances.

Thus, the ARM-based Graviton2 instances let us self-host a music bot for a very reasonable price and enjoy high quality audio streaming without any lag or choppiness.

## Accomplishments that we're proud of

We build our first Discord bot to solve a problem we had ourselves.

## What we learned

- How to develop a Discord bot with the help of the Discord.js library
- How to configure and provision all the AWS infrastructure needed for our application (EC2 instances, a VPC with subnets and security groups, and IAM roles) by using Infrastructure as Code tooling (Terraform)
- How to use build a Continuous Delivery pipeline for EC2 instances with GitHub Actions
- How to set up a CloudWatch agent to publish the application's logs from an EC2 instance to CloudWatch

## What's next for Apollonia Bot

We built this bot to solve a problem we had ourselves, and we believe that other Discord server owners and moderators could benefit from the reliability and control that a self-host music bot provides. Also, the recent death of the [Groovy](https://www.theverge.com/2021/8/24/22640024/youtube-discord-groovy-music-bot-closure) and [Rythm](https://www.theverge.com/2021/9/12/22669502/youtube-discord-rythm-music-bot-closure) bots for their violation of YouTube's Terms of Service has left a gap in the Discord music bot space.

Currently, any developer can easily install this project on their own AWS account, because we provide a Terraform config to set up the required infrastructure. However, we want to thoroughtly document the process and provide step-by-step instructions so that self-hosting a music bot on EC2 is as easy as possible.

But we want to go one step further and also provide an easier setup of the required AWS infrastructure through the AWS Marketplace, so that even non-developers can self-host this project without having to understand how to run IaC tools like Terraform or CloudFormation or how to manage environment variables and secrets.

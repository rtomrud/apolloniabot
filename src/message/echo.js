const ytdl = require("@distube/ytdl");
const Song = require("distube/src/Song.js");

const idRegExp = /\b\d{7,20}\b/;

const hasId = (userId) => ({ user: { id } }) => id === userId;

const _createStream = function (queue) {
  const [song] = queue.songs;
  const encoderArgs = queue.filter ? ["-af", this.filters[queue.filter]] : null;
  const streamOptions = {
    opusEncoded: true,
    filter: song.isLive ? "audioandvideo" : "audioonly",
    quality: "highestaudio",
    highWaterMark: this.options.highWaterMark,
    requestOptions: this.requestOptions,
    encoderArgs,
    seek: queue.beginTime / 1000,
  };
  if (song.youtube) {
    return ytdl.downloadFromInfo(song.info, streamOptions);
  }

  // Patch DisTube's _createStream to work with a Readable streamURL
  if (song.streamURL.constructor.name === "Readable") {
    return song.streamURL;
  }

  return ytdl.arbitraryStream(song.streamURL, streamOptions);
};

const echo = async function (message) {
  const { channel } = message.member.voice;
  if (!channel) {
    message.channel.send({
      embed: {
        description: "I can't join you because you're not in a voice channel",
      },
    });
    return;
  }

  const [id] = idRegExp.exec(message.content) || [];
  if (!id) {
    message.channel.send({
      embed: {
        description: "I don't know who to echo (try mentioning someone with @)",
      },
    });
    return;
  }

  const connection = channel.members.some(hasId(id))
    ? await channel.join()
    : this.voice.connections.find(({ channel: { members } }) =>
        members.some(hasId(id))
      );
  if (!connection) {
    message.channel.send({
      embed: {
        description: `I can't echo <@${id}> because they're not in a voice channel`,
      },
    });
    return;
  }

  const { username } = await this.users.fetch(id);
  const song = new Song(
    {
      title: `@${username}`,
      webpage_url: `https://discordapp.com/channels/${message.guild.id}/`,
      isLive: true,
    },
    message.author
  );
  song.streamURL = connection.receiver.createStream(id, { end: "manual" });
  this.player._createStream = _createStream.bind(this.player);
  this.player.play(message, song);
};

module.exports = echo;

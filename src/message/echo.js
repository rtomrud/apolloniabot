// const Song = require("distube/src/Song.js");

const idRegExp = /\b\d{7,20}\b/;

module.exports = function (message) {
  const channel = message.member.voice && message.member.voice.channel;
  if (!channel) {
    message.channel.send({
      embed: {
        description: "I can't join you because you're not in a voice channel",
      },
    });
    return;
  }

  const member = message.mentions.members.first();
  const userId = member
    ? member.user.id
    : (idRegExp.exec(message.content) || [])[0];
  if (!userId) {
    message.channel.send({
      embed: {
        description: "I don't know who to echo (try mentioning someone with @)",
      },
    });
    return;
  }

  channel.join().then(
    (connection) => {
      const source = this.voice.connections.find((connection) =>
        connection.channel.members.some(({ user: { id } }) => id === userId)
      );
      if (!source) {
        message.channel.send({
          embed: {
            description: `I can't echo <@${userId}> because they're not in a voice channel`,
          },
        });
        return;
      }

      // WIP
      // const queue = this.player.getQueue(message);
      // if (queue) {
      //   const song = new Song({
      //     name: `<@${userId}>`,
      //     url: `https://discordapp.com/channels/${source.channel.guild.id}/${source.channel.id}`,
      //     isLive: true,
      //   });
      //   queue.songs.unshift(song);
      // }

      connection.play(source.receiver.createStream(userId, { end: "manual" }), {
        type: "opus",
        bitrate: "auto",
      });
      message.channel.send({ embed: { description: `Echoing <@${userId}>` } });
    },
    () =>
      message.channel.send({
        embed: {
          description:
            "I can't join your voice channel because I don't have permission",
        },
      })
  );
};

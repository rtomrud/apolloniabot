module.exports = function (error, message) {
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
  });
};

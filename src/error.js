module.exports = function (message, error) {
  const { message: err } = error;
  if (err.endsWith("User is not in the voice channel.")) {
    message.channel.send({
      embed: {
        description: "I can't join you because you're not in a voice channel",
      },
    });
    return;
  }

  if (err.endsWith("You do not have permission to join this voice channel.")) {
    message.channel.send({
      embed: {
        description: "I don't have permission to join your voice channel",
      },
    });
    return;
  }

  if (err.endsWith("No result!")) {
    message.channel.send({
      embed: {
        description:
          "I couldn't find anything, check if your URL or query is correct",
      },
    });
    return;
  }

  if (err.includes("[youtube-dl] ERROR") || err.includes("youtube-dl: error")) {
    message.channel.send({
      embed: { description: "I can't play that URL, sorry" },
    });
    return;
  }

  console.error(err);
  message.channel.send({
    embed: { description: "Oops, something went wrong" },
  });
};

module.exports = function (message, error) {
  const { message: err } = error;
  if (err.endsWith("User is not in the voice channel.")) {
    message.channel.send({
      embed: {
        title: "Error",
        description: "I can't join you because you're not in a voice channel",
      },
    });
    return;
  }

  if (err.endsWith("You do not have permission to join this voice channel.")) {
    message.channel.send({
      embed: {
        title: "Error",
        description: "I don't have permission to join your voice channel",
      },
    });
    return;
  }

  if (err.endsWith("No result!")) {
    message.channel.send({
      embed: {
        title: "Error",
        description: "I can't find anything, check your URL or query",
      },
    });
    return;
  }

  if (err.includes("[youtube-dl] ERROR") || err.includes("youtube-dl: error")) {
    message.channel.send({
      embed: { title: "Error", description: "I can't play that URL" },
    });
    return;
  }

  const { author, channel, guild, id } = message;
  console.error(
    `<@${author.id}>`,
    `"${author.tag}"`,
    "ERROR",
    `/channels/${guild.id}/${channel.id}/${id}`,
    `"${err.name}: ${err.message}"`
  );
  message.channel.send({
    embed: { title: "Error", description: "I can't do that, sorry" },
  });
};

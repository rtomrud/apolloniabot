module.exports = async function (message, err) {
  const description = err.message.endsWith("User is not in the voice channel.")
    ? "I can't join you because you're not in a voice channel"
    : err.message.endsWith(
        "You do not have permission to join this voice channel."
      )
    ? "I don't have permission to join your voice channel"
    : err.message.endsWith("No result!")
    ? "I can't find anything, check your URL or query"
    : err.message.includes("youtube-dl")
    ? "I can't play that URL"
    : "";
  if (!description) {
    this.client.emit("error", err);
  }

  return message.channel.send({
    embed: {
      title: "Error",
      description: description || "I can't do that, sorry",
    },
  });
};

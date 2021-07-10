module.exports = function (error) {
  const { message } = error;
  if (
    message.endsWith("You do not have permission to join this voice channel.")
  ) {
    return "Error: I don't have permission to join your voice channel";
  }

  if (message.includes("[youtube-dl] ERROR: Unsupported URL")) {
    return "Error: I can't play that URL";
  }

  return null;
};

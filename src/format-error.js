module.exports = function (error) {
  switch (error.errorCode) {
    case "VOICE_MISSING_PERMS":
      return "Error: I don't have permission to join your voice channel";
    default: {
      if (error.message.includes("[youtube-dl] ERROR: Unsupported URL")) {
        return "Error: I can't play that URL";
      }

      return null;
    }
  }
};

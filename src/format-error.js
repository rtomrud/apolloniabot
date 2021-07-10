module.exports = function (error) {
  switch (error.errorCode) {
    case "NOT_IN_VOICE":
    case "NOT_SUPPORTED_VOICE":
    case "VOICE_CHANGE_GUILD":
      return "Error: I can't join you because you're not in a voice channel";
    case "VOICE_FULL":
      return "Error: I can't join your voice channel because it's full";
    case "VOICE_CONNECT_FAILED":
    case "VOICE_RECONNECT_FAILED":
      return "Error: I can't connect to your voice channel";
    case "VOICE_MISSING_PERMS":
      return "Error: I can't join your voice channel because I don't have permission";
    case "NO_RESULT":
      return "Error: I can't find anything";
    case "NO_RELATED":
    case "CANNOT_PLAY_RELATED":
      return "Error: I can't play any related track";
    case "UNAVAILABLE_VIDEO":
      return "Error: I can't play that because it's unavailable";
    case "UNPLAYABLE_FORMATS":
    case "NOT_SUPPORTED_URL":
    case "CANNOT_RESOLVE_SONG":
      return "Error: I can't play that";
    case "NO_VALID_SONG":
    case "EMPTY_FILTERED_PLAYLIST":
    case "EMPTY_PLAYLIST":
      return "Error: I can't play that because there's no valid track";
    case "NON_NSFW":
      return "Error: I can't play age-restricted content in a non-NSFW channel";
    default: {
      if (error.message.includes("[youtube-dl] ERROR: Unsupported URL")) {
        return "Error: I can't play that URL";
      }

      return null;
    }
  }
};

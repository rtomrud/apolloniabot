import { TextChannel } from "discord.js";

const messages = {
  NOT_IN_VOICE: "I can't join you because you're not in a voice channel",
  VOICE_FULL: "I can't join your voice channel because it's full",
  VOICE_CONNECT_FAILED:
    "I can't join you because I can't connect to your voice channel",
  VOICE_MISSING_PERMS:
    "I can't join your voice channel because I don't have permission",
  VOICE_RECONNECT_FAILED:
    "I can't join you because I can't reconnect to your voice channel",
  VOICE_CHANGE_GUILD: "I can't join you because you're in another server",
  NO_RESULT: "I can't find that",
  NO_RELATED: "I can't find any related track",
  CANNOT_PLAY_RELATED: "I can't play any related track",
  UNAVAILABLE_VIDEO: "I can't play that because it's unavailable",
  UNPLAYABLE_FORMATS: "I can't play that because it's in an unplayable format",
  NON_NSFW:
    "I can't play that because it's age-restricted content and this is a SFW channel",
  NOT_SUPPORTED_URL: "I can't play that because the website is unsupported",
  CANNOT_RESOLVE_SONG: "I can't play that because the track is unresolved",
  EMPTY_FILTERED_PLAYLIST:
    "I can't play that because there's no valid track or there's only age-restricted content and this is a SFW channel",
  EMPTY_PLAYLIST: "I can't play that because there's no valid track",
};

const defaultMessage = "Something went wrong, sorry";

export default async function error(
  channel = new TextChannel(),
  error = new Error()
) {
  const message = messages[error.errorCode] || defaultMessage;
  if (message === defaultMessage) {
    console.error(error);
  }

  await channel.interaction.reply;
  channel.interaction
    .followUp({ embeds: [{ description: `Error: ${message}` }] })
    .catch(console.error);
}

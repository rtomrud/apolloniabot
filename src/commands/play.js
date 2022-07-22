import {
  Colors,
  CommandInteraction,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "../../node_modules/distube/dist/index.js";

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play a track or playlist")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription(
        "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube"
      )
      .setRequired(true)
  );

const errorMessages = {
  VOICE_FULL: "Error: I can't join your voice channel because it's full",
  VOICE_CONNECT_FAILED:
    "Error: I can't join you because I can't connect to your voice channel",
  VOICE_MISSING_PERMS:
    "Error: I can't join your voice channel because I don't have permission",
  NO_RESULT: "Error: I can't find that",
  UNAVAILABLE_VIDEO: "Error: I can't play that because it's unavailable",
  UNPLAYABLE_FORMATS:
    "Error: I can't play that because it's in an unplayable format",
  NON_NSFW:
    "Error: I can't play that because it's age-restricted content and this is a SFW channel",
  NOT_SUPPORTED_URL:
    "Error: I can't play that because the website is unsupported",
  CANNOT_RESOLVE_SONG:
    "Error: I can't play that because the track is unresolved",
  EMPTY_FILTERED_PLAYLIST:
    "Error: I can't play that because there's no valid track or there's only age-restricted content and this is a SFW channel",
  EMPTY_PLAYLIST: "Error: I can't play that because there's no valid track",
  SPOTIFY_PLUGIN_NO_RESULT: "Error: I can't find that",
  YTDLP_ERROR: "Error: I can't play that",
};

const defaultErrorMessage = "Error: Something went wrong, sorry";

const isHttpUrl = (string) => {
  try {
    return new URL(string).protocol.startsWith("http");
  } catch {
    return false;
  }
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const query = interaction.options.getString("query");
  if (!interaction.member.voice.channel) {
    return interaction.reply({
      embeds: [
        {
          description:
            "Error: I can't join you because you're not in a voice channel",
          color: Colors.Red,
        },
      ],
    });
  }

  const [url] = query.split(" ");
  const searchUrl = isHttpUrl(url)
    ? url
    : hyperlink(
        query,
        `https://www.youtube.com/results?${new URLSearchParams({
          search_query: query,
        })}`
      );
  interaction.interactionResponse = interaction.reply({
    embeds: [{ description: `Searching "${searchUrl}"` }],
  });
  return player
    .play(interaction.member.voice.channel, query, {
      member: interaction.member,
      textChannel: interaction.channel,
      metadata: { interaction, source: "yt-dlp" },
    })
    .then(() => interaction.interactionResponse)
    .catch(async (error) => {
      if (
        !errorMessages[error.errorCode] ||
        error.errorCode === "SPOTIFY_PLUGIN_NO_RESULT" ||
        error.errorCode === "YTDLP_ERROR"
      ) {
        console.error(error);
      }

      await interaction.interactionResponse;
      return interaction.followUp({
        embeds: [
          {
            description: errorMessages[error.errorCode] || defaultErrorMessage,
            color: Colors.Red,
          },
        ],
      });
    });
};

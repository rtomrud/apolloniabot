import { CommandInteraction } from "discord.js";
import { DisTube as Player, Song } from "distube";
import { search } from "youtube-search-without-api-key";

export const data = {
  name: "play",
  description: "Play a track or playlist",
  options: [
    {
      name: "query",
      description:
        "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube",
      type: 3,
      required: true,
    },
  ],
};

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
  const query = interaction.options.get("query").value;
  const channel = await player.client.channels.fetch(interaction.channelId);
  if (!interaction.member.voice.channel) {
    return interaction.reply({
      embeds: [
        {
          description:
            "Error: I can't join you because you're not in a voice channel",
        },
      ],
    });
  }

  const [url] = query.split(" ");
  const searchUrl = isHttpUrl(url)
    ? url
    : `[${query}](https://www.youtube.com/results?${new URLSearchParams({
        search_query: query,
      })})`;
  const reply = interaction.reply({
    embeds: [{ description: `Searching "${searchUrl}"` }],
  });
  const options = {
    member: interaction.member,
    textChannel: interaction.channel,
    metadata: { interaction, source: "yt-dlp" },
  };
  channel.interaction = interaction;
  let songOrPlaylist;
  try {
    if (!isHttpUrl(url)) {
      const [result] = await search(query);
      songOrPlaylist = new Song(
        {
          id: result.id.videoId,
          url: result.url,
          name: result.title,
          duration: result.duration_raw,
        },
        options
      );
    } else {
      const plugin = player.options.plugins
        .filter(
          (plugin) =>
            plugin.type === "extractor" &&
            plugin.constructor.name !== "HTTPPlugin" &&
            plugin.constructor.name !== "HTTPSPlugin"
        )
        .find((plugin) => plugin.validate(url));
      songOrPlaylist = plugin ? await plugin.resolve(url, options) : url;
    }
  } catch (error) {
    console.error(error);
    await reply;
    return interaction.followUp({
      embeds: [{ description: "Error: I can't find that" }],
    });
  }

  await player.play(interaction.member.voice.channel, songOrPlaylist, options);
  return reply;
};

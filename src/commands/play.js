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
    metadata: { source: "yt-dlp" },
  };
  channel.interaction = interaction;

  let songOrPlaylist;
  if (!isHttpUrl(url)) {
    try {
      const [result] = await search(query);
      songOrPlaylist = new Song(
        {
          id: result.id.videoId,
          url: result.url,
          name: result.title,
          duration: result.duration_raw,
        },
        { ...options, source: options.metadata.source }
      );
    } catch (error) {
      console.error(error);
      await reply;
      return interaction.followUp({
        embeds: [{ description: "Error: I can't find that" }],
      });
    }
  }

  const extractorPlugins = player.options.plugins.filter(
    (plugin) =>
      plugin.type === "extractor" &&
      plugin.constructor.name !== "HTTPPlugin" &&
      plugin.constructor.name !== "HTTPSPlugin"
  );
  const plugin = extractorPlugins.find((plugin) => plugin.validate(url));
  if (plugin) {
    try {
      songOrPlaylist = await plugin.resolve(url, options);
    } catch (error) {
      // Workaround for throw in resolve() not triggering the error event
      console.error(error);
      await reply;
      return interaction.followUp({
        embeds: [{ description: "Error: I can't play that" }],
      });
    }
  }

  await Promise.all([
    player.play(interaction.member.voice.channel, songOrPlaylist),
    reply,
  ]);
  const queue = player.queues.get(interaction.guildId);
  return interaction.followUp({
    embeds: [
      {
        description: songOrPlaylist.songs
          ? `${
              queue.songs[0] === songOrPlaylist.songs[0] ? "Playing" : "Queued"
            } [${songOrPlaylist.songs[0].name}${
              songOrPlaylist.songs.length > 1
                ? ` and ${songOrPlaylist.songs.length - 1} more ${
                    songOrPlaylist.songs.length - 1 === 1 ? "track" : "tracks"
                  }`
                : ""
            }](${songOrPlaylist.url})`
          : `${queue.songs[0] === songOrPlaylist ? "Playing" : "Queued"} [${
              songOrPlaylist.name
            }](${songOrPlaylist.url})`,
      },
    ],
  });
};

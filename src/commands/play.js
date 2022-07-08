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
  const reply = await interaction.reply({
    embeds: [{ description: `Searching "${searchUrl}"` }],
  });
  const options = {
    member: interaction.member,
    metadata: { interaction, source: "yt-dlp" },
  };
  channel.interaction = interaction;

  if (!isHttpUrl(url)) {
    try {
      const [result] = await search(query);
      const song = new Song({
        id: result.id.videoId,
        url: result.url,
        name: result.title,
        duration: result.duration_raw,
      });
      player.play(interaction.member.voice.channel, song, options);
      return reply;
    } catch (error) {
      console.error(error);
      return interaction.followUp({
        embeds: [{ description: "Error: I can't find that" }],
      });
    }
  }

  const spotifyPlugin = player.options.plugins.find(
    (plugin) => plugin.constructor.name === "SpotifyPlugin"
  );
  if (spotifyPlugin && spotifyPlugin.validate(url)) {
    try {
      const songOrPlaylist = await spotifyPlugin.resolve(url, options);
      player.play(interaction.member.voice.channel, songOrPlaylist, options);
      return reply;
    } catch (error) {
      console.error(error);
      return interaction.followUp({
        embeds: [{ description: "Error: I can't find that" }],
      });
    }
  }

  const ytDlpPlugin = player.options.plugins.find(
    (plugin) => plugin.constructor.name === "YtDlpPlugin"
  );
  if (ytDlpPlugin && ytDlpPlugin.validate(url)) {
    try {
      const songOrPlaylist = await ytDlpPlugin.resolve(url, options);
      player.play(interaction.member.voice.channel, songOrPlaylist, options);
      return reply;
    } catch (error) {
      console.error(error);
      return interaction.followUp({
        embeds: [{ description: "Error: I can't play that" }],
      });
    }
  }

  player.play(interaction.member.voice.channel, url, options);
  return reply;
};

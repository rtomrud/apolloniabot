import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  hyperlink,
} from "discord.js";
import { Events, Playlist, Queue } from "distube";

export const event = Events.ADD_LIST;

export const listener = async function (queue: Queue, playlist: Playlist) {
  const metadata = playlist.metadata as {
    interactionResponse: Promise<InteractionResponse | null>;
  };
  const response = await metadata.interactionResponse;
  if (response == null) {
    return;
  }

  const interaction = response.interaction as ChatInputCommandInteraction;
  await interaction.followUp({
    embeds: [
      new EmbedBuilder().setDescription(
        `${
          queue.songs[0] === playlist.songs[0] ? "Playing" : "Queued"
        } ${hyperlink(
          `${playlist.songs[0].name || playlist.songs[0].url}${
            playlist.songs.length > 1
              ? ` and ${playlist.songs.length - 1} more ${
                  playlist.songs.length - 1 === 1 ? "track" : "tracks"
                }`
              : ""
          }`,
          playlist.url || playlist.songs[0].url,
        )}`,
      ),
    ],
  });
};

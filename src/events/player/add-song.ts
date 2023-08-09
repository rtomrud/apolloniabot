import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  hyperlink,
} from "discord.js";
import { Events, Queue, Song } from "distube";

export const event = Events.ADD_SONG;

export const listener = async function (queue: Queue, song: Song) {
  const metadata = song.metadata as {
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
        `${queue.songs[0] === song ? "Playing" : "Queued"} ${hyperlink(
          song.name || song.url,
          song.url,
        )}`,
      ),
    ],
  });
};

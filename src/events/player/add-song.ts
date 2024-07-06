import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  hyperlink,
} from "discord.js";
import { Events, Queue, Song } from "distube";

export const event = Events.ADD_SONG;

export const listener = async function (queue: Queue, song: Song) {
  const interactionResponse = song.metadata as Promise<InteractionResponse>;
  const response = await interactionResponse;
  if (!response || !response.interaction) {
    return;
  }

  const interaction = response.interaction as ChatInputCommandInteraction;
  await interaction.followUp({
    embeds: [
      new EmbedBuilder().setDescription(
        `${queue.songs[0] === song ? "Playing" : "Queued"} ${hyperlink(
          song.name || song.url || "",
          song.url || "",
        )}`,
      ),
    ],
  });
};

import { ChatInputCommandInteraction, Message, hyperlink } from "discord.js";
import { Events, Queue, Song } from "distube";

export const event = Events.ADD_SONG;

export const listener = async function (queue: Queue, song: Song) {
  const metadata = song.metadata as {
    interaction: ChatInputCommandInteraction;
    interactionResponse: Promise<Message>;
  };
  await metadata.interactionResponse;
  await metadata.interaction.followUp({
    embeds: [
      {
        description: `${
          queue.songs[0] === song ? "Playing" : "Queued"
        } ${hyperlink(song.name || song.url, song.url)}`,
      },
    ],
  });
};

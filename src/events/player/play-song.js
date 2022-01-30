import { Song } from "distube";

const tokenDuration = 15 * 60 * 1000;

export default function playSong(queue, song = new Song()) {
  if (song.metadata.interaction.createdTimestamp + tokenDuration < Date.now()) {
    return;
  }

  song.metadata.interaction
    .followUp({ embeds: [{ title: song.name, url: song.url }] })
    .catch((error) => {
      if (error.message !== "Invalid Webhook Token") {
        console.error(error);
      }
    });
}

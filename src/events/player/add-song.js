import { Song } from "distube";

export default function addSong(queue, song = new Song()) {
  song.metadata.interaction
    .followUp({
      embeds: [{ description: `Queued [${song.name}](${song.url})` }],
    })
    .catch(console.error);
}

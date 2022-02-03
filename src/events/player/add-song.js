import { Queue, Song } from "distube";

export default function addSong(queue = new Queue(), song = new Song()) {
  song.metadata.interaction
    .followUp({
      embeds: [
        {
          description: `${queue.songs[0] === song ? "Playing" : "Queued"} [${
            song.name
          }](${song.url})`,
        },
      ],
    })
    .catch(console.error);
}

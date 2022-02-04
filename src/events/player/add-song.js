import { Queue, Song } from "distube";

export default async function addSong(queue = new Queue(), song = new Song()) {
  await song.metadata.reply;
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

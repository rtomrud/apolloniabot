import { Queue, Song } from "distube";

export default function addSong(queue = new Queue(), song = new Song()) {
  queue.textChannel
    .send({
      embeds: [{ description: `Queued [${song.name}](${song.url})` }],
    })
    .catch(console.error);
}

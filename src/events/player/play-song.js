import { Queue, Song } from "distube";

export default function playSong(queue = new Queue(), song = new Song()) {
  queue.textChannel
    .send({
      embeds: [
        {
          title: song.name,
          url: song.url,
          description: `${song.formattedDuration} • Requested by ${song.user}`,
        },
      ],
    })
    .catch(console.error);
}

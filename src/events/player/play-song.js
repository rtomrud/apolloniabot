import { Song } from "distube";

export default function playSong(queue, song = new Song()) {
  song.metadata.interaction
    .followUp({
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

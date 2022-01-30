import { Song } from "distube";

export default function playSong(queue, song = new Song()) {
  song.metadata.interaction
    .followUp({ embeds: [{ title: song.name, url: song.url }] })
    .catch(console.error);
}

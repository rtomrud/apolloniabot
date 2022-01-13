import { Queue, Song } from "distube";

export default function playSong(queue = new Queue(), song = new Song()) {
  queue.textChannel.send({
    embeds: [
      {
        title: song.name,
        url: song.url,
        fields: [
          { name: "Duration", value: song.formattedDuration, inline: true },
          { name: "Requester", value: song.user.toString(), inline: true },
        ],
      },
    ],
  });
}

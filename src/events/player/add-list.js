import { Playlist } from "distube";

export default function addList(queue, playlist = new Playlist()) {
  playlist.metadata.interaction
    .followUp({
      embeds: [
        {
          description: `Queued [${playlist.songs[0].name}${
            playlist.songs.length > 1
              ? ` and ${playlist.songs.length - 1} more track${
                  playlist.songs.length === 2 ? "" : "s"
                }`
              : ""
          }](${playlist.url})`,
        },
      ],
    })
    .catch(console.error);
}

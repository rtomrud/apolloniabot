import { Playlist, Queue } from "distube";

export default async function addList(
  queue = new Queue(),
  playlist = new Playlist()
) {
  await playlist.metadata.reply;
  playlist.metadata.interaction
    .followUp({
      embeds: [
        {
          description: `${
            queue.songs[0] === playlist.songs[0] ? "Playing" : "Queued"
          } [${playlist.songs[0].name}${
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

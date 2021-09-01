export default function (queue) {
  return `${queue.songs.length} track${queue.songs.length === 1 ? "" : "s"} [${
    queue.formattedDuration
  }]`;
}

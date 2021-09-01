export default function (playlist) {
  return `[${playlist.name}](${playlist.url}) (${playlist.songs.length} track${
    playlist.songs.length === 1 ? "" : "s"
  }) [${playlist.formattedDuration}]`;
}

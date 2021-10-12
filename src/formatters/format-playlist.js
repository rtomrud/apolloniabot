export default function ({ formattedDuration, songs, url }) {
  const { length } = songs;
  return `[${songs[0].name}${
    length > 1 ? ` and ${length - 1} more track${length === 2 ? "" : "s"}` : ""
  }](${url}) [${formattedDuration}]`;
}

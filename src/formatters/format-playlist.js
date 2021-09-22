export default function ({ formattedDuration, name, songs: { length }, url }) {
  return `[${name}](${url}) (${length} track${
    length === 1 ? "" : "s"
  }) [${formattedDuration}]`;
}

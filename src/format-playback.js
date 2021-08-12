export default function ({
  formattedCurrentTime,
  songs: [{ formattedDuration, name, url }],
}) {
  return `[${name}](${url}) [${formattedCurrentTime}/${formattedDuration}]`;
}

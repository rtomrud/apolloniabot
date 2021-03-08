module.exports = function ({
  formattedDuration,
  name,
  songs: { length },
  url,
}) {
  const count = `${length} track${length === 1 ? "" : "s"}`;
  const duration = `[${formattedDuration}]`;
  return name && url
    ? `[${name}](${url}) (${count}) ${duration}`
    : `${count} ${duration}`;
};

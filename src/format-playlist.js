module.exports = function ({ formattedDuration, songs: { length } }) {
  return `${length} track${length === 1 ? "" : "s"} [${formattedDuration}]`;
};

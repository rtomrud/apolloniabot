module.exports = function ({ name, formattedDuration, url }) {
  return `[${name}](${url}) [${formattedDuration || "Live"}]`;
};

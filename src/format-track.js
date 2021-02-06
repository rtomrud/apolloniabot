module.exports = function ({ name, url, formattedDuration }) {
  return `[${name}](${url}) [${formattedDuration}]`;
};

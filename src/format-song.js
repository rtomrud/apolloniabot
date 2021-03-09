module.exports = function ({ name, formattedDuration, url }) {
  return `[${name}](${url}) ${
    formattedDuration !== "00:00" ? `[${formattedDuration || "Live"}]` : ""
  }`;
};

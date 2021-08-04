"use strict";

module.exports = function ({ formattedDuration, name, url }) {
  return `[${name}](${url}) [${formattedDuration}]`;
};

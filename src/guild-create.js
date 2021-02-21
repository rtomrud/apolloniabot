const who = require("./message/who.js");

module.exports = function ({ available, systemChannel }) {
  if (available && systemChannel) {
    who({ channel: systemChannel });
  }
};

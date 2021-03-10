const log = require("./log.js");

module.exports = function (f) {
  return async function (...args) {
    const message = await f.bind(this, ...args)();
    if (message) {
      if (Array.isArray(message)) {
        message.forEach(log);
      } else {
        log(message);
      }
    }

    return message;
  };
};

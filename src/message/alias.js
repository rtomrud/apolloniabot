const autoplay = require("./autoplay.js");
const drop = require("./drop.js");
const echo = require("./echo.js");
const effect = require("./effect.js");
const find = require("./find.js");
const help = require("./help.js");
const loop = require("./loop.js");
const move = require("./move.js");
const next = require("./next.js");
const pause = require("./pause.js");
const play = require("./play.js");
const queue = require("./queue.js");
const resume = require("./resume.js");
const seek = require("./seek.js");
const shuffle = require("./shuffle.js");
const stop = require("./stop.js");
const version = require("./version.js");
const volume = require("./volume.js");
const what = require("./what.js");
const who = require("./who.js");

const aliases = [
  autoplay,
  drop,
  echo,
  effect,
  find,
  help,
  loop,
  move,
  next,
  pause,
  play,
  queue,
  resume,
  seek,
  shuffle,
  stop,
  version,
  volume,
  what,
  who,
].reduce((aliases, command) => {
  aliases[command.name] = command;
  command.aliases.forEach((alias) => {
    if (Object.prototype.hasOwnProperty.call(aliases, alias)) {
      throw Error(`Duplicate alias "${alias}"`);
    }

    aliases[alias] = command;
  });
  return aliases;
}, {});

module.exports = function (argv) {
  return aliases[argv.length > 1 ? argv[1] : ""];
};

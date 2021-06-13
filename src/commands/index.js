const autoplay = require("./autoplay.js");
const dj = require("./dj.js");
const drop = require("./drop.js");
const effect = require("./effect.js");
const find = require("./find.js");
const help = require("./help.js");
const invite = require("./invite.js");
const loop = require("./loop.js");
const move = require("./move.js");
const next = require("./next.js");
const pause = require("./pause.js");
const play = require("./play.js");
const queue = require("./queue.js");
const resume = require("./resume.js");
const rickroll = require("./rickroll.js");
const seek = require("./seek.js");
const shuffle = require("./shuffle.js");
const stop = require("./stop.js");
const version = require("./version.js");
const volume = require("./volume.js");
const what = require("./what.js");

const aliases = [
  autoplay,
  dj,
  drop,
  effect,
  find,
  help,
  invite,
  loop,
  move,
  next,
  pause,
  play,
  queue,
  resume,
  rickroll,
  seek,
  shuffle,
  stop,
  version,
  volume,
  what,
].reduce((aliases, command) => {
  if (Object.prototype.hasOwnProperty.call(aliases, command.name)) {
    throw Error(`Duplicate command "${command.name}"`);
  }

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
  const alias = argv.length > 1 ? argv[1].toLowerCase() : "";
  return aliases[alias];
};

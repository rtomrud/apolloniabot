const autoplay = require("./autoplay.js");
const cut = require("./cut.js");
const drop = require("./drop.js");
const echo = require("./echo.js");
const effect = require("./effect.js");
const find = require("./find.js");
const help = require("./help.js");
const loop = require("./loop.js");
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

const aliases = {
  autoplay,
  a: autoplay,
  related: autoplay,

  cut,
  c: cut,

  drop,
  d: drop,
  delete: drop,
  remove: drop,
  rm: drop,

  echo,
  listen: echo,

  effect,
  e: effect,
  fx: effect,
  mode: effect,
  filter: effect,

  find,
  f: find,
  query: find,
  search: find,

  help,
  "--help": help,

  loop,
  l: loop,
  repeat: loop,

  next,
  n: next,
  skip: next,
  forward: next,

  pause,
  sh: pause,
  shh: pause,
  shhh: pause,
  stfu: pause,
  shut: pause,

  play,
  p: play,

  queue,
  q: queue,

  resume,
  r: resume,
  unpause: resume,

  seek,
  t: seek,
  goto: seek,
  jump: seek,

  shuffle,
  s: shuffle,
  rand: shuffle,
  random: shuffle,
  randomize: shuffle,

  stop,
  exit: stop,
  clean: stop,
  clear: stop,
  empty: stop,
  leave: stop,
  destroy: stop,
  disconnect: stop,

  version,
  "--version": version,

  volume,
  v: volume,
  loudness: volume,

  what,
  w: what,
  np: what,
  now: what,
  song: what,
  track: what,
  status: what,
  playing: what,
  nowplaying: what,

  who,
  whois: who,
  info: who,
  invite: who,
  perms: who,
  permission: who,
  permissions: who,
};

module.exports = function (argv) {
  return aliases[argv.length > 1 ? argv[1] : ""];
};

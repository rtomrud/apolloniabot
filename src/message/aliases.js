const back = require("./back.js");
const clear = require("./clear.js");
const cut = require("./cut.js");
const drop = require("./drop.js");
const echo = require("./echo.js");
const find = require("./find.js");
const help = require("./help.js");
const loop = require("./loop.js");
const louder = require("./louder.js");
const loudest = require("./loudest.js");
const next = require("./next.js");
const nightcore = require("./nightcore.js");
const pause = require("./pause.js");
const play = require("./play.js");
const queue = require("./queue.js");
const quieter = require("./quieter.js");
const repeat = require("./repeat.js");
const shuffle = require("./shuffle.js");
const stop = require("./stop.js");
const unloop = require("./unloop.js");
const unnightcore = require("./unnightcore.js");
const unpause = require("./unpause.js");
const unrepeat = require("./unrepeat.js");
const unvaporwave = require("./unvaporwave.js");
const vaporwave = require("./vaporwave.js");
const version = require("./version.js");
const what = require("./what.js");
const who = require("./who.js");

module.exports = {
  back,
  b: back,
  prev: back,
  previous: back,

  clear,
  empty: clear,
  clean: clear,

  cut,
  c: cut,

  drop,
  d: drop,
  delete: drop,
  remove: drop,
  rm: drop,

  echo,
  listen: echo,

  find,
  f: find,
  query: find,
  search: find,

  help,
  "--help": help,
  "-h": help,
  "-help": help,
  man: help,
  manual: help,

  loop,

  louder,
  loudly: louder,
  raise: louder,
  increase: louder,

  loudest,
  l: loudest,
  full: loudest,
  eleven: loudest,

  next,
  n: next,
  skip: next,
  forward: next,

  nightcore,
  nxc: nightcore,

  pause,

  play,
  p: play,

  queue,
  q: queue,

  quieter,
  quietly: quieter,
  softer: quieter,
  softly: quieter,
  lower: quieter,
  decrease: quieter,

  repeat,

  shuffle,
  s: shuffle,
  rand: shuffle,
  randomize: shuffle,

  stop,
  stfu: stop,
  shut: stop,
  unplay: stop,

  unloop,
  noloop: unloop,

  unnightcore,
  nonightcore: unnightcore,
  unnxc: unnightcore,
  nonxc: unnightcore,

  unpause,
  resume: unpause,
  r: unpause,

  unrepeat,
  norepeat: unrepeat,

  unvaporwave,
  novaporwave: unvaporwave,
  undaycore: unvaporwave,
  nodaycore: unvaporwave,

  vaporwave,
  daycore: vaporwave,

  version,

  what,
  w: what,
  now: what,
  song: what,
  track: what,
  playing: what,

  who,
};

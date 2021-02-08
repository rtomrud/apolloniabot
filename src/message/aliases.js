const autoplay = require("./autoplay.js");
const cut = require("./cut.js");
const drop = require("./drop.js");
const echo = require("./echo.js");
const find = require("./find.js");
const help = require("./help.js");
const loop = require("./loop.js");
const next = require("./next.js");
const nightcore = require("./nightcore.js");
const pause = require("./pause.js");
const play = require("./play.js");
const queue = require("./queue.js");
const repeat = require("./repeat.js");
const reverse = require("./reverse.js");
const shuffle = require("./shuffle.js");
const stop = require("./stop.js");
const unautoplay = require("./unautoplay.js");
const unfilter = require("./unfilter.js");
const unloop = require("./unloop.js");
const unpause = require("./unpause.js");
const unrepeat = require("./unrepeat.js");
const vaporwave = require("./vaporwave.js");
const version = require("./version.js");
const volume = require("./volume.js");
const what = require("./what.js");
const who = require("./who.js");

module.exports = {
  autoplay,
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

  next,
  n: next,
  skip: next,
  forward: next,

  nightcore,
  nxc: nightcore,

  pause,
  stfu: pause,
  shut: pause,

  play,
  p: play,

  queue,
  q: queue,

  repeat,

  reverse,
  backward: reverse,

  shuffle,
  s: shuffle,
  rand: shuffle,
  randomize: shuffle,

  stop,
  clean: stop,
  clear: stop,
  empty: stop,

  unautoplay,
  noautoplay: unautoplay,
  unrelated: unautoplay,
  norelated: unautoplay,

  unfilter,
  nofilter: unfilter,
  reset: unfilter,

  unloop,
  noloop: unloop,

  unpause,
  resume: unpause,
  r: unpause,

  unrepeat,
  norepeat: unrepeat,

  vaporwave,
  daycore: vaporwave,

  version,

  volume,
  v: volume,
  loudness: volume,

  what,
  w: what,
  now: what,
  song: what,
  track: what,
  playing: what,

  who,
};

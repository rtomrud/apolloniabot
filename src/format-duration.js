module.exports = function (ms) {
  return new Date(ms)
    .toISOString()
    .slice(11, -5)
    .replace(/^0(0:)?0?/, "");
};

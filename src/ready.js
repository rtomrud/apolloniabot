module.exports = function () {
  const { id, tag } = this.user;
  console.log(`<@${id}>`, `"${tag}"`, "READY", `/`);
};

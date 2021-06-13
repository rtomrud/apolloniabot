module.exports = async function () {
  console.log(this.readyAt.toISOString(), "READY");
};

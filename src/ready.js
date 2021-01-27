module.exports = function () {
  this.user.setActivity("lena", { type: "LISTENING" });
  console.log(this.readyAt, this.user.tag);
};

module.exports = function (guild) {
  const { id, tag } = this.user;
  console.log(`<@${id}>`, `"${tag}"`, "GUILD_DELETE", `/guilds/${guild.id}`);
};

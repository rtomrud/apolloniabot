const who = require("./message/who.js");

module.exports = function (guild) {
  const { id, tag } = this.user;
  console.log(`<@${id}>`, `"${tag}"`, "GUILD_CREATE", `/guilds/${guild.id}`);

  const { available, systemChannel } = guild;
  if (available && systemChannel) {
    who({ channel: systemChannel });
  }
};

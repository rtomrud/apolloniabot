const who = require("./message/who.js");

module.exports = async function ({
  available,
  id,
  joinedAt,
  name,
  systemChannel,
}) {
  console.log(joinedAt.toISOString(), "GUILD_CREATE", id, JSON.stringify(name));
  if (available && systemChannel) {
    who({ channel: systemChannel });
  }
};

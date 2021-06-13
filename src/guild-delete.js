module.exports = async function ({ id, leftAt = new Date(), name }) {
  console.log(leftAt.toISOString(), "GUILD_DELETE", id, JSON.stringify(name));
};

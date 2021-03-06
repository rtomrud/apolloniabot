module.exports = async function ({ name, message }) {
  const { id, tag } = this.user;
  console.error(`<@${id}>`, `"${tag}"`, "ERROR", `/`, `"${name}: ${message}"`);
};

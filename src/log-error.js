module.exports = function (
  error,
  { author, channel, createdAt, guild, id, member } = {
    author: this.user,
    createdAt: new Date(),
  }
) {
  console.error(
    createdAt.toISOString(),
    author.id,
    guild
      ? `/${guild.id}/${channel.id}/${id}`
      : channel
      ? `/${channel.id}/${id}`
      : `/`,
    JSON.stringify((member && member.nickname) || author.username),
    JSON.stringify(`${error.name}: ${error.message}`)
  );
};

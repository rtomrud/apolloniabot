const error = function (
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

const formatEmbeds = ([embed]) =>
  [
    embed.title,
    embed.description,
    ...embed.fields.map(({ name, value }) => `${name}\n${value}`),
    embed.footer && embed.footer.text,
  ]
    .filter((s) => s != null)
    .join("\n");

const formatAttachments = (attachments) =>
  `\n${attachments.values().next().value.url}`;

const log = function ({
  attachments,
  author,
  channel,
  content,
  createdAt,
  embeds,
  guild,
  id,
  member,
}) {
  console.log(
    createdAt.toISOString(),
    author.id,
    guild ? `/${guild.id}/${channel.id}/${id}` : `/${channel.id}/${id}`,
    JSON.stringify((member && member.nickname) || author.username),
    JSON.stringify(
      `${content || (embeds.length > 0 ? formatEmbeds(embeds) : "")}${
        attachments.size > 0 ? formatAttachments(attachments) : ""
      }`
    )
  );
};

module.exports = { error, log };

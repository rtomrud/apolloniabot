const formatMessage = ({
  attachments,
  author: { id: authorId, username },
  channel: { id: channelId },
  content,
  createdAt,
  embeds: [embed],
  guild: { id: guildId },
  id,
}) =>
  [
    createdAt.toISOString().slice(0, 10),
    createdAt.toISOString().slice(11, 19),
    authorId,
    `/${guildId}/${channelId}/${id}`,
    JSON.stringify(
      `${username}: ${
        content ||
        [
          embed.author && embed.author.name,
          embed.title,
          embed.description,
          embed.fields.map(({ name, value }) => `${name}\n${value}`).join("\n"),
          embed.footer && embed.footer.text,
        ]
          .filter((s) => s != null)
          .join("\n")
      }`
    ),
    attachments.size > 0 ? attachments.values().next().url : "-",
  ].join("\t");

module.exports = function (f) {
  return async function (...args) {
    const message = await f.bind(this, ...args)();
    if (message) {
      const messages = Array.isArray(message) ? message.flat() : [message];
      messages.forEach((message) => console.log(formatMessage(message)));
    }
  };
};

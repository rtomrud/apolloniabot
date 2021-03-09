const formatMessage = ({
  attachments,
  author: { id: authorId, username },
  channel: { id: channelId },
  content,
  createdAt,
  embeds: [embed],
  guild: { id: guildId },
  id,
  member: { nickname },
}) =>
  [
    createdAt.toISOString(),
    authorId,
    `/${guildId}/${channelId}/${id}`,
    JSON.stringify(nickname || username),
    JSON.stringify(
      content ||
        [
          embed.title,
          embed.description,
          ...embed.fields.map(({ name, value }) => `${name}\n${value}`),
          embed.footer && embed.footer.text,
        ]
          .filter((s) => s != null)
          .join("\n")
    ),
    attachments.size > 0 ? attachments.values().next().url : "-",
  ].join(" ");

module.exports = function (f) {
  return async function (...args) {
    const message = await f.bind(this, ...args)();
    if (message) {
      const messages = Array.isArray(message) ? message.flat() : [message];
      messages.forEach((message) => console.log(formatMessage(message)));
    }
  };
};

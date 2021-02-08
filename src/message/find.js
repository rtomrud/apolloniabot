const ytsr = require("@distube/ytsr");

module.exports = function (message, argv) {
  const query = argv.slice(2).join(" ");
  if (!query) {
    message.channel.send({
      embed: { description: "I don't know what you want to find" },
    });
    return;
  }

  ytsr(query, { limit: 10 }).then(({ items }) =>
    message.channel.send({
      embed: {
        description: "Found tracks:",
        fields: items
          .slice(0, items.length < 10 ? items.length : 10)
          .map(
            ({ author: { name: channel } = {}, duration, name, url }, i) => ({
              name: `${i + 1} ${channel || ""}`,
              value: `[${name}](${url}) [${duration}]`,
            })
          ),
      },
    })
  );
};

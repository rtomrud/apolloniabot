const limit = 10;

module.exports = function (message, argv) {
  const query = argv.slice(2).join(" ");
  if (!query) {
    message.channel.send({
      embed: { description: "I don't know what you want to find" },
    });
    return;
  }

  this.player.search(query).then((searchResults) =>
    message.channel.send({
      embed: {
        description: "Found tracks:",
        fields: searchResults
          .slice(0, searchResults.length < limit ? searchResults.length : limit)
          .map(({ formattedDuration, name, url }, i) => ({
            name: i + 1,
            value: `[${name}](${url}) [${formattedDuration}]`,
          })),
      },
    })
  );
};

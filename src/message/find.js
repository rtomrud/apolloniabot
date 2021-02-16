const limit = 10;

const find = function (message, argv) {
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

module.exports = Object.assign(find, {
  aliases: ["f", "query", "search"],
  usage: {
    embed: {
      fields: [
        {
          name: "NAME",
          value: "**lena find** - Query YouTube",
        },
        {
          name: "SYNOPSIS",
          value: "lena find QUERY\naliases: f",
        },
        {
          name: "DESCRIPTION",
          value:
            "Searches on YouTube with the specified QUERY and shows the search results.",
        },
        {
          name: "EXAMPLES",
          value: `
\`lena find Tchaikovsky 1812 Overture\`
\`lena f The Wreck Of S.S Needle\`
`,
        },
        {
          name: "SEE ALSO",
          value: `
\`lena help play\`
`,
        },
      ],
    },
  },
});

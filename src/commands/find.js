const find = async function (message, argv) {
  const query = argv.slice(2).join(" ");
  if (!query) {
    return message.reply({
      embed: {
        title: "Error",
        description: "I don't know what you want to find",
      },
    });
  }

  return this.player.search(query, { limit: 10 }).then(
    (searchResults) =>
      message.reply({
        embed: {
          title: "Results",
          fields: searchResults.map(
            ({ formattedDuration, name, type, uploader, url }) => ({
              name: uploader.name || "[Unknown]",
              value: `[${name}](${url}) [${
                type === "video" ? formattedDuration : "Playlist"
              }]`,
            })
          ),
          footer: { text: "Powered by YouTube" },
        },
      }),
    () =>
      message.reply({
        embed: {
          title: "Error",
          description: "I couldn't find anything, try again",
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
          value: "lena find - Query YouTube",
        },
        {
          name: "SYNOPSIS",
          value: "**lena find** QUERY\naliases: f",
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

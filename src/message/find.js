const ytsr = require("@distube/ytsr");
const SearchResult = require("distube/src/SearchResult.js");
const formatSong = require("../format-song.js");

const find = function (message, argv) {
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
        title: "Search results",
        fields: items.map((item, i) => ({
          name: `${i + 1}. ${item.author.name}`,
          value: formatSong(new SearchResult(item)),
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

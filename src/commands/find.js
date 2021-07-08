const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");

exports.data = {
  name: "find",
  description: "Search on YouTube and show the search results",
  options: [
    {
      name: "query",
      description: "The search query",
      type: "STRING",
      required: true,
    },
  ],
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const query = interaction.options.get("query")?.value;
  interaction.reply({ embeds: [{ description: `Searching "${query}"` }] });
  return distube.search(query, { limit: 10 }).then(
    (searchResults) =>
      interaction.followUp({
        embeds: [
          {
            title: "Results",
            fields: searchResults.map((searchResult) => ({
              name: searchResult.uploader.name || "[Unknown]",
              value: `[${searchResult.name}](${searchResult.url}) [${
                searchResult.type === "video"
                  ? searchResult.formattedDuration
                  : "Playlist"
              }]`,
            })),
            footer: { text: "Powered by YouTube" },
          },
        ],
        ephemeral: true,
      }),
    () =>
      interaction.followUp({
        embeds: [{ description: "Error: I couldn't find anything" }],
        ephemeral: true,
      })
  );
};

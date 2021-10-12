import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
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

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const query = interaction.options.get("query")?.value;
  interaction.reply({ embeds: [{ description: `Searching "${query}"` }] });
  return player.search(query, { limit: 10 }).then(
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
        embeds: [{ description: "Error: I cant't find anything" }],
        ephemeral: true,
      })
  );
};

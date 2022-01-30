import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "search",
  description: "Search on YouTube and show the search results",
  options: [
    {
      name: "query",
      description: "The search query",
      type: 3,
      required: true,
    },
  ],
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const query = interaction.options.get("query")?.value;
  const message = interaction.reply({
    embeds: [{ description: `Searching "${query}"` }],
  });
  return player.search(query, { limit: 10 }).then(
    async (searchResults) => {
      await message;
      return interaction.followUp({
        embeds: [
          {
            title: "Results",
            fields: searchResults.map((searchResult) => ({
              name: searchResult.uploader.name || "-",
              value: `[${searchResult.name}](${searchResult.url}) • ${
                searchResult.type === "video"
                  ? searchResult.formattedDuration
                  : "Playlist"
              }`,
            })),
            footer: { text: "Powered by YouTube" },
          },
        ],
        ephemeral: true,
      });
    },
    async () => {
      await message;
      return interaction.followUp({
        embeds: [{ description: "Error: I cant't find anything" }],
        ephemeral: true,
      });
    }
  );
};

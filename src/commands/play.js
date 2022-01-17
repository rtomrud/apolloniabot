import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "play",
  description: "Play a track or playlist",
  options: [
    {
      name: "query",
      description:
        "The URL of a track, or the URL of a playlist on YouTube or Spotify, or a query to search on YouTube",
      type: 3,
      required: true,
    },
  ],
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const query = interaction.options.get("query").value;
  const channel = await player.client.channels.fetch(interaction.channelId);
  player
    .play(interaction.member.voice.channel, query, {
      member: interaction.member,
      textChannel: channel,
    })
    .catch((error) => player.emit("error", channel, error));
  return interaction.reply({
    embeds: [{ description: `Searching "${query}"` }],
  });
};

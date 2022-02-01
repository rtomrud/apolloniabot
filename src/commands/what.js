import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "what",
  description: "Show what's playing and the status of the player",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing in queue" }],
    });
  }

  return interaction.reply({
    embeds: [
      {
        title: queue.songs[0].name,
        url: queue.songs[0].url,
        description: `${queue.formattedCurrentTime}/${
          queue.songs[0].formattedDuration
        } • Requested by ${queue.songs[0].user} • Volume at ${
          queue.volume
        } • Repeat ${["off", "track", "queue"][queue.repeatMode]} • Autoplay ${
          queue.autoplay ? "on" : "off"
        } • Effects: ${queue.filters.join(", ") || "none"}`,
      },
    ],
  });
};

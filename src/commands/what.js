import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";
import formatPlayback from "../formatters/format-playback.js";
import formatQueue from "../formatters/format-queue.js";

export const data = {
  name: "what",
  description: "Show what's playing and the status of the player",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing in queue" }],
      ephemeral: true,
    });
  }

  return interaction.reply({
    embeds: [
      {
        title: queue.playing ? "Now playing" : "Now paused",
        description: formatPlayback(queue),
        fields: [
          {
            name: "Requester",
            value: queue.songs[0].user.toString(),
            inline: true,
          },
          {
            name: "Queue",
            value: formatQueue(queue),
            inline: true,
          },
          {
            name: "Volume",
            value: String(queue.volume),
            inline: true,
          },
          {
            name: "Autoplay",
            value: queue.autoplay ? "on" : "off",
            inline: true,
          },
          {
            name: "Loop",
            value: ["off", "track", "queue"][queue.repeatMode],
            inline: true,
          },
          {
            name: "Effects",
            value: queue.filters.join(", ") || "off",
            inline: true,
          },
        ],
      },
    ],
    ephemeral: true,
  });
};

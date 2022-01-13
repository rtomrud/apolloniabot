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
      ephemeral: true,
    });
  }

  return interaction.reply({
    embeds: [
      {
        title: queue.songs[0].name,
        url: queue.songs[0].url,
        description: `${queue.playing ? "Playing" : "Paused"} at ${
          queue.formattedCurrentTime
        }`,
        fields: [
          {
            name: "Duration",
            value: queue.songs[0].formattedDuration,
          },
          {
            name: "Requester",
            value: queue.songs[0].user.toString(),
            inline: true,
          },
          {
            name: "Queue",
            value: `${queue.songs.length} track${
              queue.songs.length === 1 ? "" : "s"
            } [${queue.formattedDuration}]`,
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

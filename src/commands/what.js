import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("what")
  .setDescription("Show what's playing and the status of the player");

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing in queue", color: "RED" }],
    });
  }

  return interaction.reply({
    embeds: [
      {
        title: queue.songs[0].name,
        url: queue.songs[0].url,
        fields: [
          {
            name: "Duration",
            value: `${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}`,
            inline: true,
          },
          {
            name: "Volume",
            value: String(queue.volume),
            inline: true,
          },
          {
            name: "Requester",
            value: String(queue.songs[0].user),
            inline: true,
          },
          {
            name: "Repeat",
            value: ["off", "track", "queue"][queue.repeatMode],
            inline: true,
          },
          {
            name: "Bitrate",
            value: `${queue.voiceChannel.bitrate / 1000}kbps`,
            inline: true,
          },
          {
            name: "Effects",
            value: queue.filters.join(", ") || "none",
            inline: true,
          },
        ],
      },
    ],
  });
};

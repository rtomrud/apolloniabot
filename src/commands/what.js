import { Colors, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("what")
  .setDescription("Show what's playing now");

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing is playing", color: Colors.Red }],
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
            name: "Bitrate",
            value: `${queue.voiceChannel.bitrate / 1000}kbps`,
            inline: true,
          },
          {
            name: "Requester",
            value: String(queue.songs[0].user),
            inline: true,
          },
        ],
      },
    ],
  });
};

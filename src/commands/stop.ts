import {
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  hyperlink,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import player from "../player.ts";

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription(
    "Stop the playback, clear the queue and leave the voice channel",
  )
  .setContexts(InteractionContextType.Guild);

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Nothing to stop")
          .setColor(Colors.Red),
      ],
    });
  }

  await queue.stop();
  queue.voice.leave();
  return interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        queue.playing
          ? `Stopped ${
            hyperlink(
              queue.songs[0].name || queue.songs[0].url || "",
              queue.songs[0].url || "",
            )
          } at ${queue.formattedCurrentTime}`
          : "Stopped",
      ),
    ],
  });
};

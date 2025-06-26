import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffle the queue")
  .setContexts(InteractionContextType.Guild);

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue || queue.songs.length <= 1) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing to shuffle")
          .setColor(Colors.Red),
      ],
    });
  }

  await queue.shuffle();
  return interaction.reply({
    embeds: [new EmbedBuilder().setDescription("Shuffled the queue")],
  });
};

import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("shuffle")
  .setDescription("Shuffle the queue")
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player,
) {
  const queue = player.queues.get(interaction);
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

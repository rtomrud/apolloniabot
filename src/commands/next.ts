import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionContextType,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import player from "../player.js";

export const data = new SlashCommandBuilder()
  .setName("next")
  .setDescription("Skip to the next song in the queue")
  .setContexts(InteractionContextType.Guild);

export const execute = async function (
  interaction: ChatInputCommandInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue || (queue.songs.length <= 1 && !queue.autoplay)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("No more songs in the queue")
          .setColor(Colors.Red),
      ],
    });
  }

  const song = await queue.skip();
  return interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        `Skipped to ${hyperlink(song.name || song.url || "", song.url || "")}`,
      ),
    ],
  });
};

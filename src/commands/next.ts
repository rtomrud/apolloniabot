import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("next")
  .setDescription("Play the next track in the queue")
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player,
) {
  const queue = player.queues.get(interaction);
  if (!queue || (queue.songs.length <= 1 && !queue.autoplay)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing to skip")
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

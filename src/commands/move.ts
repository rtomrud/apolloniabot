import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("move")
  .setDescription("Move a track to another position in the queue")
  .addIntegerOption((option) =>
    option
      .setName("track")
      .setDescription("The position of the track to move")
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName("position")
      .setDescription("The position to move the track to")
      .setRequired(true)
  )
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player
) {
  const queue = player.queues.get(interaction);
  if (!queue || queue.songs.length <= 1) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing to move")
          .setColor(Colors.Red),
      ],
    });
  }

  const track = interaction.options.getInteger("track", true);
  const position = interaction.options.getInteger("position", true);
  if (!(track !== 0 && track <= queue.songs.length)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: No such track")
          .setColor(Colors.Red),
      ],
    });
  }

  if (!(position !== 0 && position <= queue.songs.length)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: No such position")
          .setColor(Colors.Red),
      ],
    });
  }

  const from = track < 0 ? Math.max(0, queue.songs.length + track) : track - 1;
  const to =
    position < 0 ? Math.max(0, queue.songs.length + position) : position - 1;
  queue.songs.splice(to, 0, queue.songs.splice(from, 1)[0]);
  if (from === 0 || to === 0) {
    await queue.jump(0);
  }

  return interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        `Moved track ${from + 1} to position ${to + 1}`
      ),
    ],
  });
};

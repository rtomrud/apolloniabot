import {
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("remove")
  .setDescription("Remove a track from the queue")
  .addIntegerOption((option) =>
    option
      .setName("track")
      .setDescription("The position of the track to remove")
      .setRequired(true),
  )
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player,
) {
  const queue = player.queues.get(interaction);
  if (!queue) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing to remove")
          .setColor(Colors.Red),
      ],
    });
  }

  const track = interaction.options.getInteger("track", true);
  if (!(track !== 0 && track <= queue.songs.length)) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: No such track")
          .setColor(Colors.Red),
      ],
    });
  }

  const start = track < 0 ? Math.max(0, queue.songs.length + track) : track - 1;
  const song = queue.songs[start];
  if (start === 0) {
    if (queue.songs.length <= 1 && !queue.autoplay) {
      await queue.stop();
    } else {
      await queue.skip();
    }
  } else {
    queue.songs.splice(start, 1);
  }

  return interaction.reply({
    embeds: [
      new EmbedBuilder().setDescription(
        `Removed ${hyperlink(song.name || song.url, song.url)}`,
      ),
    ],
  });
};

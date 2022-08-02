import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
  hyperlink,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("next")
  .setDescription("Play the next track in the queue");

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player
) {
  const queue = player.queues.get(interaction);
  if (!queue || (queue.songs.length <= 1 && !queue.autoplay)) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to skip", color: Colors.Red }],
    });
  }

  const song = await queue.skip();
  return interaction.reply({
    embeds: [
      {
        description: `Skipped to ${hyperlink(song.name || song.url, song.url)}`,
      },
    ],
  });
};

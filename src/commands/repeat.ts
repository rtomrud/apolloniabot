import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
} from "discord.js";
import { DisTube as Player, RepeatMode } from "distube";

const repeatModes = {
  [RepeatMode.DISABLED]: "off",
  [RepeatMode.QUEUE]: "queue",
  [RepeatMode.SONG]: "track",
};

export const data = new SlashCommandBuilder()
  .setName("repeat")
  .setDescription("Repeat the queue or current track")
  .addStringOption((option) =>
    option
      .setName("mode")
      .setDescription("The repeat mode")
      .addChoices(
        ...Object.entries(repeatModes).map(([value, name]) => ({ name, value }))
      )
  );

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player
) {
  const queue = player.queues.get(interaction);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing is playing", color: Colors.Red }],
    });
  }

  const mode = interaction.options.getString("mode");
  if (mode) {
    queue.setRepeatMode(Number(mode));
  }

  return interaction.reply({
    embeds: [{ description: `Repeat: ${repeatModes[queue.repeatMode]}` }],
  });
};

import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionType,
  SelectMenuBuilder,
  SelectMenuInteraction,
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
      .setName("repeat")
      .setDescription("The repeat mode")
      .addChoices(
        ...Object.entries(repeatModes).map(([value, name]) => ({ name, value }))
      )
  );

export const handler = async function (
  interaction: ChatInputCommandInteraction | SelectMenuInteraction,
  player: Player
) {
  const queue = player.queues.get(interaction);
  if (!queue) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing is playing")
          .setColor(Colors.Red),
      ],
    });
  }

  const mode =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getString("repeat")
      : interaction.values[0];
  if (mode) {
    queue.setRepeatMode(Number(mode));
  }

  const components = [
    new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder().setCustomId("/repeat").addOptions(
        Object.entries(repeatModes).map(([value, label]) => ({
          default: queue.repeatMode === Number(value),
          label: `Repeat: ${label}`,
          value,
        }))
      )
    ),
  ];
  return interaction.type === InteractionType.ApplicationCommand
    ? interaction.reply({ components })
    : interaction.update({ components });
};

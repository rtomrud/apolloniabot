import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionType,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { DisTube as Player } from "distube";

const effectChoices = [
  { name: "bassboost", value: "bassboost" },
  { name: "echo", value: "echo" },
  { name: "nightcore", value: "nightcore" },
  { name: "vaporwave", value: "vaporwave" },
];

export const data = new SlashCommandBuilder()
  .setName("effects")
  .setDescription("Enable or disable an effect")
  .addStringOption((option) =>
    option
      .setName("effect")
      .setDescription("The effect to enable or disable")
      .addChoices(...effectChoices),
  )
  .addBooleanOption((option) =>
    option
      .setName("disable")
      .setDescription("Whether to turn off the effect or not (default: False)"),
  )
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction | StringSelectMenuInteraction,
  player: Player,
) {
  const queue = player.queues.get(interaction);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing is playing")
          .setColor(Colors.Red),
      ],
    });
  }

  const filters =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getString("effect")
      : interaction.values;
  const disable =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getBoolean("disable")
      : null;
  if (filters == null && disable != null) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: No effect specified")
          .setColor(Colors.Red),
      ],
    });
  }

  if (
    interaction.type !== InteractionType.ApplicationCommand &&
    Array.isArray(filters)
  ) {
    queue.filters.names.forEach((filter) => {
      if (!effectChoices.some(({ value }) => filter === value)) {
        filters.push(filter);
      }
    });
    queue.filters.set(filters);
  } else if (filters && !disable) {
    queue.filters.add(filters);
  } else if (filters && disable) {
    queue.filters.remove(filters);
  }

  const components = [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("/effects effect:")
        .setPlaceholder("No effects")
        .setMaxValues(effectChoices.length)
        .setMinValues(0)
        .addOptions(
          effectChoices.map(({ name, value }) => ({
            default: queue.filters.has(value),
            label: name,
            value,
          })),
        ),
    ),
  ];
  return interaction.type === InteractionType.ApplicationCommand
    ? interaction.reply({ components })
    : interaction.update({ components });
};

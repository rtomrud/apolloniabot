import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  InteractionType,
  SlashCommandBuilder,
  SelectMenuBuilder,
  SelectMenuInteraction,
} from "discord.js";
import { DisTube as Player } from "distube";

const effectChoices = [
  { name: "3d", value: "3d" },
  { name: "bassboost", value: "bassboost" },
  { name: "echo", value: "echo" },
  { name: "karaoke", value: "karaoke" },
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
      .addChoices(...effectChoices)
  )
  .addBooleanOption((option) =>
    option
      .setName("enable")
      .setDescription("Whether to turn on the effect or not (default: True)")
  );

export const handler = async function (
  interaction: ChatInputCommandInteraction | SelectMenuInteraction,
  player: Player
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
  const enable =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getBoolean("enable")
      : null;
  if (filters == null && enable != null) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: No effect specified")
          .setColor(Colors.Red),
      ],
    });
  }

  if (interaction.type !== InteractionType.ApplicationCommand) {
    queue.filters.set(filters as string[]);
  } else if (filters && (enable || enable == null)) {
    queue.filters.add(filters);
  } else if (filters && enable === false) {
    queue.filters.remove(filters);
  }

  const components = [
    new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId("/effects")
        .setPlaceholder("No effects")
        .setMaxValues(effectChoices.length)
        .setMinValues(0)
        .addOptions(
          effectChoices.map(({ name, value }) => ({
            default: queue.filters.has(value),
            label: name,
            value,
          }))
        )
    ),
  ];
  return interaction.type === InteractionType.ApplicationCommand
    ? interaction.reply({ components })
    : interaction.update({ components });
};

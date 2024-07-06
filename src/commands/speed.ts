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
import player from "../player.js";

const speedChoices = [
  { name: "0.5", value: "0.5" },
  { name: "0.75", value: "0.75" },
  { name: "1.0", value: "1.0" },
  { name: "1.25", value: "1.25" },
  { name: "1.5", value: "1.5" },
  { name: "1.75", value: "1.75" },
  { name: "2", value: "2" },
];

export const data = new SlashCommandBuilder()
  .setName("speed")
  .setDescription("Set the playback speed")
  .addStringOption((option) =>
    option
      .setName("speed")
      .setDescription("The playback speed")
      .addChoices(...speedChoices),
  )
  .setDMPermission(false);

export const handler = async function (
  interaction: ChatInputCommandInteraction | StringSelectMenuInteraction,
) {
  const queue = player.queues.get(interaction.guildId as string);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription("Error: Nothing is playing")
          .setColor(Colors.Red),
      ],
    });
  }

  const filter =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getString("speed")
      : interaction.values[0];
  if (filter != null) {
    const filters = queue.filters.names.filter(
      (filter) => !speedChoices.some(({ value }) => filter === value),
    );
    if (filter !== "1.0") {
      filters.push(filter);
    }

    queue.filters.set(filters);
  }

  const components = [
    new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("/speed speed:")
        .setPlaceholder("1.0")
        .addOptions(
          speedChoices.map(({ name, value }) => ({
            default:
              queue.filters.has(value) ||
              (value === "1.0" &&
                speedChoices
                  .map(({ value }) => value)
                  .filter((speedFilter) => queue.filters.has(speedFilter))
                  .length === 0),
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

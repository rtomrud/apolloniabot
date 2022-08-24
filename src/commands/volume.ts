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
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Set the volume of the playback")
  .addIntegerOption((option) =>
    option
      .setName("volume")
      .setDescription("The volume to set (between 0 and 100)")
      .setMaxValue(100)
      .setMinValue(0)
  )
  .setDMPermission(false);

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

  const volume =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getInteger("volume")
      : Number(interaction.values[0]);
  if (volume != null) {
    queue.setVolume(volume);
  }

  const components = [
    new ActionRowBuilder<SelectMenuBuilder>().addComponents(
      new SelectMenuBuilder()
        .setCustomId("/volume volume:")
        .setPlaceholder(`Volume: ${queue.volume}`)
        .addOptions(
          ["0", "25", "50", "75", "100"].map((value) => ({
            default: queue.volume === Number(value),
            label: `Volume: ${value}`,
            value,
          }))
        )
    ),
  ];
  return interaction.type === InteractionType.ApplicationCommand
    ? interaction.reply({ components })
    : interaction.update({ components });
};

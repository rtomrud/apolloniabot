import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  Colors,
  Interaction,
  InteractionReplyOptions,
  InteractionType,
  InteractionUpdateOptions,
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
  );

export const handler = async function (
  interaction: ChatInputCommandInteraction | SelectMenuInteraction,
  player: Player
) {
  const queue = player.queues.get(interaction as Interaction);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing is playing", color: Colors.Red }],
    });
  }

  const volume =
    interaction.type === InteractionType.ApplicationCommand
      ? interaction.options.getInteger("volume")
      : Number(interaction.values[0]);
  if (volume != null) {
    queue.setVolume(volume);
  }

  const options = {
    components: [
      new ActionRowBuilder<SelectMenuBuilder>().addComponents(
        new SelectMenuBuilder()
          .setCustomId("/volume")
          .setPlaceholder(`Volume: ${queue.volume}`)
          .addOptions(
            ["0", "25", "50", "75", "100"].map((value) => ({
              default: queue.volume === Number(value),
              label: `Volume: ${value}`,
              value,
            }))
          )
      ),
    ],
  } as InteractionReplyOptions & InteractionUpdateOptions;
  return interaction.type === InteractionType.ApplicationCommand
    ? interaction.reply(options)
    : interaction.update(options);
};

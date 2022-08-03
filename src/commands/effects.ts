import {
  ChatInputCommandInteraction,
  Colors,
  SlashCommandBuilder,
} from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("effects")
  .setDescription("Enable or disable an effect")
  .addStringOption((option) =>
    option
      .setName("effect")
      .setDescription("The effect to enable or disable")
      .addChoices(
        { name: "3d", value: "3d" },
        { name: "bassboost", value: "bassboost" },
        { name: "echo", value: "echo" },
        { name: "karaoke", value: "karaoke" },
        { name: "nightcore", value: "nightcore" },
        { name: "vaporwave", value: "vaporwave" }
      )
  )
  .addBooleanOption((option) =>
    option
      .setName("enable")
      .setDescription("Whether to turn on the effect or not (default: True)")
  );

export const handler = async function (
  interaction: ChatInputCommandInteraction,
  player: Player
) {
  const queue = player.queues.get(interaction);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing is playing", color: Colors.Red }],
    });
  }

  const filter = interaction.options.getString("effect");
  const enable = interaction.options.getBoolean("enable");
  if (filter == null && enable != null) {
    return interaction.reply({
      embeds: [
        { description: "Error: No effect specified", color: Colors.Red },
      ],
    });
  }

  if (filter && !queue.filters.has(filter) && (enable || enable == null)) {
    queue.filters.add(filter);
  } else if (filter && queue.filters.has(filter) && enable === false) {
    queue.filters.remove(filter);
  }

  return interaction.reply({
    embeds: [
      { description: `Effects: ${queue.filters.names.join(", ") || "none"}` },
    ],
  });
};

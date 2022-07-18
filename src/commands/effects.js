import { Colors, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DisTube as Player } from "../../node_modules/distube/dist/index.js";

export const data = new SlashCommandBuilder()
  .setName("effects")
  .setDescription("Set the specified effect")
  .addStringOption((option) =>
    option
      .setName("effect")
      .setDescription("The effect to set")
      .setRequired(true)
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
      .setDescription("Whether to turn on the effect or not")
      .setRequired(true)
  );

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [
        {
          description: "Error: Nothing to apply effects to",
          color: Colors.Red,
        },
      ],
    });
  }

  const filter = interaction.options.getString("effect");
  const enable = interaction.options.getBoolean("enable");
  if (!queue.filters.has(filter) && enable) {
    queue.filters.add(filter);
  } else if (queue.filters.has(filter) && !enable) {
    queue.filters.remove(filter);
  }

  return interaction.reply({
    embeds: [
      { description: `Effects: ${queue.filters.names.join(", ") || "none"}` },
    ],
  });
};

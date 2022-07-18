import { Colors, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DisTube as Player } from "../../node_modules/distube/dist/index.js";

export const data = new SlashCommandBuilder()
  .setName("repeat")
  .setDescription("Repeat the queue or current track")
  .addStringOption((option) =>
    option
      .setName("mode")
      .setDescription("The repeat mode")
      .setRequired(true)
      .addChoices(
        { name: "off", value: "off" },
        { name: "queue", value: "queue" },
        { name: "track", value: "track" }
      )
  );

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to repeat", color: Colors.Red }],
    });
  }

  const mode = interaction.options.getString("mode");
  queue.setRepeatMode(mode === "queue" ? 2 : mode === "track" ? 1 : 0);
  return interaction.reply({ embeds: [{ description: `Repeat ${mode}` }] });
};

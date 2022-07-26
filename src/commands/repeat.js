import { Colors, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("repeat")
  .setDescription("Repeat the queue or current track")
  .addStringOption((option) =>
    option
      .setName("mode")
      .setDescription("The repeat mode")
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
      embeds: [{ description: "Error: Nothing is playing", color: Colors.Red }],
    });
  }

  const mode = interaction.options.getString("mode");
  if (mode) {
    queue.setRepeatMode(mode === "queue" ? 2 : mode === "track" ? 1 : 0);
  }

  return interaction.reply({
    embeds: [
      { description: `Repeat: ${["off", "track", "queue"][queue.repeatMode]}` },
    ],
  });
};

import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("effects")
  .setDescription("Toggle the specified effect")
  .addStringOption((option) =>
    option
      .setName("effect")
      .setDescription("The effect to toggle")
      .setRequired(true)
      .addChoices(
        { name: "3d", value: "3d" },
        { name: "bassboost", value: "bassboost" },
        { name: "echo", value: "echo" },
        { name: "karaoke", value: "karaoke" },
        { name: "nightcore", value: "nightcore" },
        { name: "vaporwave", value: "vaporwave" }
      )
  );

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [
        { description: "Error: Nothing to apply effects to", color: "RED" },
      ],
    });
  }

  const filter = interaction.options.getString("effect");
  queue.setFilter(filter || false);
  return interaction.reply({
    embeds: [{ description: `Effects: ${queue.filters.join(", ") || "none"}` }],
  });
};

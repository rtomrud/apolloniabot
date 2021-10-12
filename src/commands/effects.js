import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";

export const data = {
  name: "effects",
  description: "Toggle the specified effect",
  options: [
    {
      name: "effect",
      description: "The effect to toggle",
      type: "STRING",
      required: true,
      choices: [
        { name: "3d", value: "3d" },
        { name: "bassboost", value: "bassboost" },
        { name: "echo", value: "echo" },
        { name: "karaoke", value: "karaoke" },
        { name: "nightcore", value: "nightcore" },
        { name: "vaporwave", value: "vaporwave" },
      ],
    },
  ],
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new DisTube()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to apply effects to" }],
    });
  }

  const filter = interaction.options.get("effect")?.value;
  queue.setFilter(filter || false);
  return interaction.reply({
    embeds: [{ description: `Effects: ${queue.filters.join(", ") || "off"}` }],
  });
};

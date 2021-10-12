import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";

export const data = {
  name: "loop",
  description: "Loop the queue or current track",
  options: [
    {
      name: "mode",
      description: "The loop mode",
      type: "STRING",
      required: true,
      choices: [
        { name: "off", value: "off" },
        { name: "queue", value: "queue" },
        { name: "track", value: "track" },
      ],
    },
  ],
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new DisTube()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to loop" }],
    });
  }

  const mode = interaction.options.get("mode")?.value;
  queue.setRepeatMode(mode === "queue" ? 2 : mode === "track" ? 1 : 0);
  return interaction.reply({ embeds: [{ description: `Loop: ${mode}` }] });
};

import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "repeat",
  description: "Repeat the queue or current track",
  options: [
    {
      name: "mode",
      description: "The repeat mode",
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
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to repeat" }],
    });
  }

  const mode = interaction.options.get("mode")?.value;
  queue.setRepeatMode(mode === "queue" ? 2 : mode === "track" ? 1 : 0);
  return interaction.reply({ embeds: [{ description: `Repeat: ${mode}` }] });
};

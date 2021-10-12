import { CommandInteraction } from "discord.js";
import { DisTube } from "distube";

export const data = {
  name: "autoplay",
  description: "Toggle whether a related track is played when the queue ends",
};

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new DisTube()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to autoplay" }],
    });
  }

  queue.toggleAutoplay();
  return interaction.reply({
    embeds: [{ description: `Autoplay: ${queue.autoplay ? "on" : "off"}` }],
  });
};

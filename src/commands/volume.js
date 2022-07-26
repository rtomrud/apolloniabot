import { Colors, CommandInteraction, SlashCommandBuilder } from "discord.js";
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
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing is playing", color: Colors.Red }],
    });
  }

  const volume = interaction.options.getInteger("volume");
  if (volume) {
    queue.setVolume(volume);
  }

  return interaction.reply({
    embeds: [{ description: `Volume: ${queue.volume}` }],
  });
};

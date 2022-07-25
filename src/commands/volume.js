import { Colors, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Set the volume of the playback")
  .addIntegerOption((option) =>
    option
      .setName("percent")
      .setDescription("The volume (between 0 and 100)")
      .setRequired(true)
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
      embeds: [
        {
          description: "Error: Nothing to set volume to",
          color: Colors.Red,
        },
      ],
    });
  }

  const percent = interaction.options.getInteger("percent");
  queue.setVolume(percent);
  return interaction.reply({
    embeds: [{ description: `Set volume to ${queue.volume}` }],
  });
};

import { SlashCommandBuilder, hyperlink } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("volume")
  .setDescription("Set the volume of the playback")
  .addIntegerOption((option) =>
    option
      .setName("percent")
      .setDescription("The volume (0 to 100)")
      .setRequired(true)
  );

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to set volume to" }],
    });
  }

  const percent = interaction.options.getInteger("percent");
  if (!(percent >= 0 && percent <= 100)) {
    return interaction.reply({
      embeds: [
        {
          description: `Error: ${
            percent > 100
              ? `These don't ${hyperlink(
                  "go to 11",
                  "https://youtu.be/4xgx4k83zzc"
                )}`
              : "No such volume"
          }`,
        },
      ],
    });
  }

  queue.setVolume(percent);
  return interaction.reply({
    embeds: [{ description: `Set volume to ${queue.volume}` }],
  });
};

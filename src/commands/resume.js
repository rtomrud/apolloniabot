import { SlashCommandBuilder, hyperlink } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = new SlashCommandBuilder()
  .setName("resume")
  .setDescription("Resume the playback");

export const handler = async function (
  interaction = new CommandInteraction(),
  player = new Player()
) {
  const queue = player.queues.get(interaction.guildId);
  if (!queue || queue.playing) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to resume", color: "RED" }],
    });
  }

  queue.resume();
  return interaction.reply({
    embeds: [
      {
        description: `Resumed ${hyperlink(
          queue.songs[0].name,
          queue.songs[0].url
        )} at ${queue.formattedCurrentTime}`,
      },
    ],
  });
};

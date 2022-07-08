import { CommandInteraction } from "discord.js";
import { DisTube as Player } from "distube";

export const data = {
  name: "volume",
  description: "Set the volume of the playback",
  options: [
    {
      name: "percent",
      description: "The volume (0 to 100)",
      type: 4,
      required: true,
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
      embeds: [{ description: "Error: Nothing to set volume to" }],
    });
  }

  const percent = interaction.options.get("percent")?.value;
  if (!(percent >= 0 && percent <= 100)) {
    return interaction.reply({
      embeds: [
        {
          description: `Error: ${
            percent > 100
              ? "These don't [go to 11](https://youtu.be/4xgx4k83zzc)"
              : "No such volume"
          })`,
        },
      ],
    });
  }

  queue.setVolume(percent);
  return interaction.reply({
    embeds: [{ description: `Set volume to ${queue.volume}` }],
  });
};

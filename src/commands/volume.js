const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");

exports.data = {
  name: "volume",
  description: "Set the volume of the playback",
  options: [
    {
      name: "percent",
      description: "The volume (1 to 100)",
      type: "INTEGER",
      required: true,
    },
  ],
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildId);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to set volume to" }],
    });
  }

  const percent = interaction.options.get("percent")?.value;
  if (!(percent > 0 && percent <= 100)) {
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
    embeds: [{ description: `Volume: ${queue.volume}` }],
  });
};

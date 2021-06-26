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
  const queue = distube.queues.get(interaction.guildID);
  if (!queue) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to set volume to" }],
    });
  }

  const percent = interaction.options.get("percent").value;
  if (percent <= 0) {
    return interaction.reply({
      embeds: [
        { title: "Error", description: "I can't set the volume that low" },
      ],
    });
  }

  if (percent > 100) {
    return interaction.reply({
      embeds: [
        {
          title: "Error",
          description: "I can't [go to 11](https://youtu.be/4xgx4k83zzc)",
        },
      ],
    });
  }

  queue.setVolume(percent);
  return interaction.reply({
    embeds: [{ title: "Volume", description: percent }],
  });
};

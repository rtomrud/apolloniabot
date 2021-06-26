const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");

exports.data = {
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

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue) {
    return interaction.reply({
      embeds: [{ description: "Error: Nothing to loop" }],
    });
  }

  const mode = interaction.options.values().next().value.value;
  queue.setRepeatMode(mode === "off" ? 0 : mode === "track" ? 1 : 2);
  return interaction.reply({ embeds: [{ description: `Loop: ${mode}` }] });
};

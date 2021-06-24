const { Interaction } = require("discord.js");
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
        { name: "off", value: "0" },
        { name: "queue", value: "2" },
        { name: "track", value: "1" },
      ],
    },
  ],
};

exports.handler = async function (
  interaction = new Interaction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to loop" }],
    });
  }

  const mode = Number(interaction.options.values().next().value.value);
  const repeatMode = queue.setRepeatMode(mode);
  return interaction.reply({
    embeds: [
      { title: "Loop", description: ["off", "track", "queue"][repeatMode] },
    ],
  });
};

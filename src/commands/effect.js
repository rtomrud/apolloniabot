const { Interaction } = require("discord.js");
const { default: DisTube } = require("distube");

exports.data = {
  name: "effect",
  description: "Toggles the specified effect",
  options: [
    {
      name: "effect",
      description: "The effect to toggle",
      type: "STRING",
      required: true,
      choices: [
        { name: "3d", value: "3d" },
        { name: "bassboost", value: "bassboost" },
        { name: "echo", value: "echo" },
        { name: "karaoke", value: "karaoke" },
        { name: "nightcore", value: "nightcore" },
        { name: "vaporwave", value: "vaporwave" },
      ],
    },
  ],
};

exports.handler = async function (
  interaction = new Interaction(),
  distube = new DisTube()
) {
  const queue = distube.queues.get(interaction.guildID);
  if (!queue || !queue.playing) {
    return interaction.reply({
      embeds: [{ title: "Error", description: "Nothing to apply effect to" }],
    });
  }

  const filter = interaction.options.get("effect").value;
  const filters = queue.setFilter(filter);
  return interaction.reply({
    embeds: [{ title: "Effects", description: filters.join(", ") || "off" }],
  });
};

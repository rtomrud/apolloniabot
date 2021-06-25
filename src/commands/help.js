const { Collection, Interaction } = require("discord.js");
const { default: DisTube } = require("distube");

exports.data = {
  name: "help",
  description: "Show help",
};

exports.handler = async function (
  interaction = new Interaction(),
  distube = new DisTube()
) {
  const commands = await interaction.guild.commands
    .fetch()
    .catch(() => new Collection());
  return interaction.reply({
    embeds: [
      {
        title: "Lena Bot",
        description: `I play music. [Invite me to your server!](https://discord.com/oauth2/authorize?client_id=${distube.client.user.id}&permissions=2150647872&scope=bot%20applications.commands)`,
        url: "https://discord.gg/wp3HWnUDMa",
        fields: [...commands].map(([, { name, description }]) => ({
          name: `/${name}`,
          value: description,
        })),
      },
    ],
  });
};

const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");

exports.data = {
  name: "help",
  description: "Show help",
};

exports.handler = async function (
  interaction = new CommandInteraction(),
  distube = new DisTube()
) {
  const guild = await distube.client.guilds.fetch(interaction.guildId);
  const commands = await guild.commands.fetch();
  return interaction.reply({
    embeds: [
      {
        title: "Lena Bot",
        description: `I play music. [Invite me to your server!](https://discord.com/oauth2/authorize?client_id=${distube.client.user.id}&permissions=2150647808&scope=bot%20applications.commands)`,
        url: "https://discord.gg/wp3HWnUDMa",
        fields: Array.from(commands, ([, command]) => ({
          name: `/${command.name}`,
          value: command.description,
        })),
      },
    ],
    ephemeral: true,
  });
};

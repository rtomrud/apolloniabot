const { CommandInteraction } = require("discord.js");
const { default: DisTube } = require("distube");
const inviteUrl = require("../invite-url.js");

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
        description: `I play music. [Invite me to your server!](${inviteUrl(
          distube.client.user.id
        )})`,
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
